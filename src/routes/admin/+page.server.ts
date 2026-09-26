import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { getAdminArticles } from '$lib/server/cms';

async function count(db: ElseedD1Database | undefined, sql: string) {
  if (!db) return 0;
  try {
    const result = await db.prepare(sql).first<{ count: number }>();
    return Number(result?.count ?? 0);
  } catch {
    return 0;
  }
}

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }

  const db = platform?.env?.DB;
  const articles = await getAdminArticles(db);

  const [journeys, newsletter, events] = await Promise.all([
    count(db, 'SELECT COUNT(*) AS count FROM journey_sessions'),
    count(db, "SELECT COUNT(*) AS count FROM newsletter_subscribers WHERE status = 'subscribed'"),
    count(db, 'SELECT COUNT(*) AS count FROM interaction_events')
  ]);

  return {
    stats: {
      articles: articles.length,
      published: articles.filter((item) => item.status === 'published').length,
      drafts: articles.filter((item) => item.status === 'draft').length,
      journeys,
      newsletter,
      events
    },
    recentArticles: articles.slice(0, 5),
    connections: {
      d1: Boolean(db),
      magazine: true,
      journeys: Boolean(db),
      newsletter: Boolean(db),
      medusa: typeof platform?.env?.MEDUSA_BACKEND_URL === 'string'
    }
  };
};
