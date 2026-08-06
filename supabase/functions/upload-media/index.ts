// @ts-nocheck
/* upload-media
 *
 * Issues a short-lived signed upload URL for one file, then gets out of the way.
 * The browser PUTs the bytes straight to storage.
 *
 * That indirection is not decoration. An Edge Function has a request body limit
 * and a recitation of Jawshan Kabeer runs an hour, so carrying the bytes through
 * here would fail on exactly the files this exists to accept. What the function
 * still decides is everything that matters: whether this caller may upload at
 * all, into which bucket, under what path, and how large the file may be. A
 * signed token is issued for one path and expires; it is not a key to the bucket.
 *
 * Same standing caveat as upload-pdf, which this replaces: the in-app admin
 * screen is a client-side gate (see README, Known gaps), so this is a bounded
 * write and not an authenticated one. Real admin authentication is the fix.
 *
 * Deploy:  supabase functions deploy upload-media --no-verify-jwt
 * Env:     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ABI_INSTALL_PEPPER
 */
const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PEPPER = Deno.env.get('ABI_INSTALL_PEPPER') ?? '';

const KINDS = {
  pdf: { bucket: 'library-pdfs', max: 25 * 1024 * 1024, ext: 'pdf' },
  audio: { bucket: 'library-audio', max: 60 * 1024 * 1024, ext: 'mp3' },
};
const RATE = { WINDOW_MS: 3_600_000, MAX_IN_WINDOW: 40 };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-abi-install',
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

/* Recorded, never used to build the path. A filename is caller-controlled text,
 * and the one place it must not reach is the URL. */
function cleanName(raw: string) {
  let v = '';
  try { v = decodeURIComponent(String(raw ?? '')); } catch { v = String(raw ?? ''); }
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

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'bad_request' }, 400);

  const kind = String(body.kind ?? '');
  const spec = KINDS[kind as keyof typeof KINDS];
  if (!spec) return json({ error: 'bad_kind' }, 400);

  /* The declared size is a claim, and it is treated as one: refusing here saves
   * the caller an upload that storage would reject anyway. The binding limit is
   * the bucket's own file_size_limit, which the caller cannot talk its way past. */
  const bytes = Number(body.bytes ?? 0);
  if (!Number.isFinite(bytes) || bytes <= 0) return json({ error: 'bad_size' }, 400);
  if (bytes > spec.max) return json({ error: 'too_large', maxBytes: spec.max }, 413);

  const installId = String(body.installId ?? req.headers.get('x-abi-install') ?? '').slice(0, 100);
  const installHash = await sha256Hex((installId || 'anonymous') + '|' + PEPPER);

  const since = new Date(Date.now() - RATE.WINDOW_MS).toISOString();
  const recent = await rest(
    `library_pdfs?select=id&install_hash=eq.${installHash}&created_at=gte.${since}`,
  );
  if (!recent.ok) {
    console.error('rate check failed', recent.status);
    return json({ error: 'store_failed' }, 503);
  }
  const rows = await recent.json().catch(() => []);
  if (Array.isArray(rows) && rows.length >= RATE.MAX_IN_WINDOW) {
    return json({ error: 'rate_limited', retryAfterMs: RATE.WINDOW_MS }, 429);
  }

  /* Generated here and nowhere else, so there is no traversal to escape and no
   * name to collide with. */
  const path = `${new Date().getUTCFullYear()}/${crypto.randomUUID()}.${spec.ext}`;

  const signed = await fetch(
    `${SB_URL}/storage/v1/object/upload/sign/${spec.bucket}/${path}`,
    {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ expiresIn: 900 }),
    },
  );
  if (!signed.ok) {
    const detail = await signed.text().catch(() => '');
    console.error('sign failed', signed.status, detail.slice(0, 300));
    return json({ error: signed.status === 404 ? 'bucket_missing' : 'sign_failed' }, 500);
  }
  const { url: signedPath } = await signed.json();

  const publicUrl = `${SB_URL}/storage/v1/object/public/${spec.bucket}/${path}`;

  /* Written before the upload rather than after: this row is the rate-limit
   * counter, and a counter that only increments on success would let a caller
   * hold the door open by never finishing. An abandoned upload leaves a row
   * pointing at nothing, which is the cheaper of the two mistakes. */
  const ins = await rest('library_pdfs', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({
      path,
      url: publicUrl,
      bytes: Math.round(bytes),
      kind,
      bucket: spec.bucket,
      filename: cleanName(body.filename) || null,
      install_hash: installHash,
    }),
  });
  if (!ins.ok) console.error('ledger write failed', ins.status);

  return json({
    ok: true,
    uploadUrl: `${SB_URL}/storage/v1${signedPath}`,
    publicUrl,
    path,
    bucket: spec.bucket,
  });
});
