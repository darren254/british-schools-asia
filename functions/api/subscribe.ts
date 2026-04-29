interface Env {
  EMAIL_SUBSCRIBERS: KVNamespace;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let payload: { email?: string; hp?: string; source?: string };
  try {
    payload = await context.request.json();
  } catch {
    return json({ ok: false, error: 'Invalid JSON' }, 400);
  }

  // Honeypot — bots fill this; humans never see it. Silent success.
  if (payload.hp && payload.hp.length > 0) {
    return json({ ok: true });
  }

  const email = (payload.email || '').trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }

  const existing = await context.env.EMAIL_SUBSCRIBERS.get(email);
  if (existing) {
    return json({ ok: true, alreadySubscribed: true });
  }

  const ip = context.request.headers.get('cf-connecting-ip') || '';
  const country = (context.request as any).cf?.country || '';
  const ua = context.request.headers.get('user-agent') || '';

  await context.env.EMAIL_SUBSCRIBERS.put(
    email,
    JSON.stringify({
      email,
      subscribedAt: new Date().toISOString(),
      source: (payload.source || 'homepage').slice(0, 64),
      ip,
      country,
      ua: ua.slice(0, 256),
    })
  );

  return json({ ok: true });
};

export const onRequest: PagesFunction<Env> = async () => {
  return json({ ok: false, error: 'Method not allowed' }, 405);
};
