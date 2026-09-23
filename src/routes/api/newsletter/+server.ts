import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: RequestHandler = async ({ request, platform }) => {
  let payload: { email?: unknown; source?: unknown; website?: unknown };

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, message: 'درخواست نامعتبر است.' }, { status: 400 });
  }

  if (typeof payload.website === 'string' && payload.website.trim()) {
    return json({ ok: true, message: 'عضویت انجام شد.' });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim().toLowerCase() : '';
  const source =
    typeof payload.source === 'string' && payload.source.trim()
      ? payload.source.trim().slice(0, 64)
      : 'homepage';

  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return json({ ok: false, message: 'لطفاً یک ایمیل معتبر وارد کن.' }, { status: 400 });
  }

  const db = platform?.env?.DB;
  if (!db) {
    return json(
      { ok: false, message: 'سرویس عضویت موقتاً در دسترس نیست. دوباره امتحان کن.' },
      { status: 503 }
    );
  }

  try {
    const result = await db
      .prepare(
        `INSERT INTO newsletter_subscribers
          (email, status, source, consented_at, created_at, updated_at)
         VALUES (?, 'subscribed', ?, datetime('now'), datetime('now'), datetime('now'))
         ON CONFLICT(email) DO UPDATE SET
           status = 'subscribed',
           source = excluded.source,
           consented_at = datetime('now'),
           updated_at = datetime('now')`
      )
      .bind(email, source)
      .run();

    if (result.success === false) {
      throw new Error(result.error ?? 'D1 insert failed');
    }

    await db
      .prepare(
        `INSERT INTO interaction_events
          (event_name, payload_json, created_at)
         VALUES ('newsletter_subscribed', ?, datetime('now'))`
      )
      .bind(JSON.stringify({ source }))
      .run();

    return json({ ok: true, message: 'عضویتت ثبت شد. از اینجا به بعد خبرهای خوب می‌رسه ☕' });
  } catch (error) {
    console.error('newsletter subscription failed', error);
    return json(
      { ok: false, message: 'ثبت عضویت انجام نشد. چند لحظه بعد دوباره امتحان کن.' },
      { status: 500 }
    );
  }
};
