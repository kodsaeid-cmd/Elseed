import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getCoffeeStoryHistory, getDailyCoffeeStory } from '$lib/server/coffeeStories';

function clean(value: unknown, max = 120) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ ok: false }, { status: 503 });

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const anonymousId = clean(body.anonymousId, 100);
  const localDate = clean(body.localDate, 10);

  if (!anonymousId || !/^\d{4}-\d{2}-\d{2}$/.test(localDate)) {
    return json({ ok: false }, { status: 400 });
  }

  try {
    const story = await getDailyCoffeeStory(db, anonymousId, localDate);
    const history = await getCoffeeStoryHistory(db, anonymousId, 8);

    if (!story) {
      return json({ ok: true, story: null, history: [] }, { headers: { 'cache-control': 'no-store' } });
    }

    return json(
      { ok: true, story, history },
      { headers: { 'cache-control': 'no-store' } }
    );
  } catch (error) {
    console.error('[elseed:daily-story]', error);
    return json({ ok: false }, { status: 500 });
  }
};
