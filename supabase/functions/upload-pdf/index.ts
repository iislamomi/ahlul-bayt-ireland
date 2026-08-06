// @ts-nocheck
/* upload-pdf
 *
 * Takes a PDF for the Books section and puts it in storage under the service
 * role, because the bucket grants write access to nobody. The anon key travels
 * in app.js, so anything the anon key could write to, anyone could write to —
 * and a document served from the mosque's own address is the one most likely to
 * be believed.
 *
 * That does not make this an authenticated endpoint. The in-app admin screen is
 * a client-side gate (see README, Known gaps), so what this function actually
 * provides is a bounded write: PDFs only, checked at the first five bytes rather
 * than taken on the caller's word, capped in size, and rate limited per
 * installation. Real admin authentication is the fix; this is the floor beneath
 * it, and the audit trail in library_pdfs is what makes a flood reviewable.
 *
 * Deploy:  supabase functions deploy upload-pdf --no-verify-jwt
 * Env:     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ABI_INSTALL_PEPPER
 */
const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PEPPER = Deno.env.get('ABI_INSTALL_PEPPER') ?? '';

const BUCKET = 'library-pdfs';
const MAX_BYTES = 25 * 1024 * 1024;
const RATE = { WINDOW_MS: 3_600_000, MAX_IN_WINDOW: 10 };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-abi-install, x-abi-filename',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

/* Kept for the record only — never used to build the stored path. A filename is
 * caller-controlled text, and the one place it must not reach is the URL. */
function cleanName(raw: string) {
  let v = '';
  try { v = decodeURIComponent(raw); } catch { v = raw; }
  return v
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '')
    .replace(/[\\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  /* Content-Length is a claim, so it is only used to refuse early. The real
   * limit is applied to the bytes actually received, below. */
  const claimed = Number(req.headers.get('content-length') ?? '0');
  if (claimed && claimed > MAX_BYTES) return json({ error: 'too_large', maxBytes: MAX_BYTES }, 413);

  const buf = new Uint8Array(await req.arrayBuffer());
  if (buf.byteLength === 0) return json({ error: 'empty' }, 400);
  if (buf.byteLength > MAX_BYTES) return json({ error: 'too_large', maxBytes: MAX_BYTES }, 413);

  // The five bytes that spell %PDF- . A content type is whatever the caller
  // typed; this is the file itself.
  const magic = buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46 && buf[4] === 0x2d;
  if (!magic) return json({ error: 'not_a_pdf' }, 415);

  /* A caller that sends no installation id used to skip the rate limit entirely,
   * which made the limit optional for exactly the caller least likely to respect
   * it. Anonymous uploads now share one bucket of their own, so leaving the
   * header off is a worse deal than sending it, not a better one. */
  const installId = (req.headers.get('x-abi-install') ?? '').slice(0, 100);
  const installHash = await sha256Hex((installId || 'anonymous') + '|' + PEPPER);

  const since = new Date(Date.now() - RATE.WINDOW_MS).toISOString();
  const recent = await rest(
    `library_pdfs?select=id&install_hash=eq.${installHash}&created_at=gte.${since}`,
  );
  if (recent.ok) {
    const rows = await recent.json().catch(() => []);
    if (Array.isArray(rows) && rows.length >= RATE.MAX_IN_WINDOW) {
      return json({ error: 'rate_limited', retryAfterMs: RATE.WINDOW_MS }, 429);
    }
  } else {
    // the ledger is how the limit is counted; if it cannot be read, do not
    // fall through to an unlimited write
    console.error('rate check failed', recent.status);
    return json({ error: 'store_failed' }, 503);
  }

  /* The path is generated here and nowhere else. Nothing the caller sent shapes
   * it, so there is no traversal to escape and no name to collide with. */
  const now = new Date();
  const path = `${now.getUTCFullYear()}/${crypto.randomUUID()}.pdf`;

  const put = await fetch(`${SB_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/pdf',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'x-upsert': 'false',
    },
    body: buf,
  });
  if (!put.ok) {
    const detail = await put.text().catch(() => '');
    console.error('storage put failed', put.status, detail.slice(0, 300));
    return json({ error: put.status === 404 ? 'bucket_missing' : 'store_failed' }, 500);
  }

  const url = `${SB_URL}/storage/v1/object/public/${BUCKET}/${path}`;

  // The row is the audit trail and the rate-limit ledger. A failure to write it
  // must not strand a file that is already stored and already reachable.
  const ins = await rest('library_pdfs', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      path,
      url,
      bytes: buf.byteLength,
      filename: cleanName(req.headers.get('x-abi-filename') ?? '') || null,
      install_hash: installHash,
    }),
  });
  if (!ins.ok) console.error('ledger write failed', ins.status);

  return json({ ok: true, url, bytes: buf.byteLength });
});
