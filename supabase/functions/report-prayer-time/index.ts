// @ts-nocheck
/* report-prayer-time
 *
 * Takes a "this time looks wrong" note from anyone, without an account. Writes
 * to a table the anon key cannot read, because a report is a message to the
 * administrators and not community content.
 *
 * Nothing identifying is accepted: there is no name, email or phone field, and
 * anything the caller sends beyond the fields below is dropped rather than
 * stored. The install hash exists only to rate-limit.
 *
 * Deploy:  supabase functions deploy report-prayer-time --no-verify-jwt
 * Env:     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ABI_INSTALL_PEPPER
 */
const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const PEPPER = Deno.env.get('ABI_INSTALL_PEPPER') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const PRAYERS = ['Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight'];
const SOURCES = ['live', 'cached', 'preset', 'fallback'];
const HHMM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
const RATE = { WINDOW_MS: 300_000, MAX_IN_WINDOW: 3 };

const clean = (v: unknown, max: number) =>
  String(v ?? '')
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

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

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'bad_request' }, 400);

  const reportId = String(body.reportId ?? '').slice(0, 64);
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(reportId)) return json({ error: 'bad_report_id' }, 400);

  const prayer = clean(body.prayer, 20);
  if (!PRAYERS.includes(prayer)) return json({ error: 'bad_prayer' }, 400);

  const shown = clean(body.shownTime, 5);
  const expected = clean(body.expectedTime, 5);
  if (shown && !HHMM.test(shown)) return json({ error: 'bad_shown_time' }, 400);
  if (expected && !HHMM.test(expected)) return json({ error: 'bad_expected_time' }, 400);
  if (!expected && !clean(body.note, 500)) {
    return json({ error: 'nothing_to_report', message: 'Give the correct time or a short note.' }, 400);
  }

  const source = clean(body.timeSource, 12);
  const appDate = clean(body.appDate, 10);
  const installId = clean(body.installId, 100);
  const installHash = installId ? await sha256Hex(installId + '|' + PEPPER) : null;

  if (installHash) {
    const since = new Date(Date.now() - RATE.WINDOW_MS).toISOString();
    const recent = await rest(
      `prayer_time_reports?select=id&install_hash=eq.${installHash}&created_at=gte.${since}`,
    );
    if (recent.ok) {
      const rows = await recent.json().catch(() => []);
      if (Array.isArray(rows) && rows.length >= RATE.MAX_IN_WINDOW) {
        return json({ error: 'rate_limited', retryAfterMs: RATE.WINDOW_MS }, 429);
      }
    }
  }

  const ins = await rest('prayer_time_reports', {
    method: 'POST',
    headers: { Prefer: 'return=minimal,resolution=ignore-duplicates' },
    body: JSON.stringify({
      report_id: reportId,
      location_id: clean(body.locationId, 64) || 'unknown',
      location_name: clean(body.locationName, 80) || 'Unknown',
      prayer,
      shown_time: shown || null,
      expected_time: expected || null,
      note: clean(body.note, 500) || null,
      time_source: SOURCES.includes(source) ? source : null,
      app_date: /^\d{4}-\d{2}-\d{2}$/.test(appDate) ? appDate : null,
      install_hash: installHash,
    }),
  });

  if (!ins.ok && ins.status !== 409) return json({ error: 'store_failed' }, 500);
  return json({ ok: true });
});
