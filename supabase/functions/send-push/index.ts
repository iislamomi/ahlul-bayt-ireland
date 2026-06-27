// @ts-nocheck
import webpush from 'npm:web-push@3';

const VAPID_PUBLIC  = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE = Deno.env.get('VAPID_PRIVATE_KEY')!;
const SB_URL        = Deno.env.get('SUPABASE_URL')!;
const SB_KEY        = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

webpush.setVapidDetails('mailto:admin@ahlulbaytireland.ie', VAPID_PUBLIC, VAPID_PRIVATE);

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS });

  const { title = 'Ahlul Bayt Ireland', body = '', url = '/', type = 'update' } = await req.json().catch(() => ({}));

  // Read all push subscriptions via service role key (bypasses RLS)
  const r = await fetch(`${SB_URL}/rest/v1/push_subscriptions?select=id,endpoint,p256dh,auth`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
  });
  const subs: { id: number; endpoint: string; p256dh: string; auth: string }[] = await r.json().catch(() => []);
  if (!Array.isArray(subs) || subs.length === 0) {
    return new Response(JSON.stringify({ sent: 0, total: 0 }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
  }

  const payload = JSON.stringify({ title, body, icon: '/icon-192.png', badge: '/icon-192.png', url, type });

  const results = await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
        { TTL: 86400 }
      )
    )
  );

  // Remove subscriptions that returned 410 Gone or 404 (expired/invalid)
  const expiredIds = results.reduce<number[]>((acc, r, i) => {
    if (r.status === 'rejected') {
      const code = (r.reason as any)?.statusCode;
      if (code === 410 || code === 404) acc.push(subs[i].id);
    }
    return acc;
  }, []);
  if (expiredIds.length > 0) {
    await fetch(`${SB_URL}/rest/v1/push_subscriptions?id=in.(${expiredIds.join(',')})`, {
      method: 'DELETE',
      headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` }
    }).catch(() => {});
  }

  const sent = results.filter(r => r.status === 'fulfilled').length;
  return new Response(JSON.stringify({ sent, total: subs.length }), {
    headers: { ...CORS, 'Content-Type': 'application/json' }
  });
});
