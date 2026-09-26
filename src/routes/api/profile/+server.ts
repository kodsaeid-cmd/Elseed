import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readCoffeeProfile, saveCoffeeProfileSignal } from '$lib/server/coffeeProfile';

function text(value: unknown, max = 160) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ ok: false, error: 'Database unavailable' }, { status: 503 });

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const anonymousId = text(body.anonymousId, 100);
  if (!anonymousId) return json({ ok: false }, { status: 400 });

  try {
    if (body.mode === 'signal') {
      const key = text(body.key, 80);
      const value = text(body.value, 120);
      const label = text(body.label, 240);
      const source = text(body.source, 180) || 'coffee-and-me';

      if (!/^[a-z0-9_.:-]+$/i.test(key) || !value || !label) {
        return json({ ok: false }, { status: 400 });
      }

      await saveCoffeeProfileSignal(db, { anonymousId, key, value, label, source });
      const profile = await readCoffeeProfile(db, anonymousId);
      return json({ ok: true, profile });
    }

    const profile = await readCoffeeProfile(db, anonymousId);
    return json({ ok: true, profile }, { headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('[elseed:coffee-profile]', error);
    return json({ ok: false }, { status: 500 });
  }
};
