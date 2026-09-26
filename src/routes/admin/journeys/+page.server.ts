import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
  const db = platform?.env?.DB;

  if (!db) return { connected: false, summary: [], recent: [], profiles: [] };

  try {
    const [summary, recent, profiles] = await Promise.all([
      db.prepare(
        `SELECT journey_type, status, COUNT(*) AS count
         FROM journey_sessions GROUP BY journey_type, status ORDER BY journey_type, status`
      ).all<{ journey_type: string; status: string; count: number }>(),
      db.prepare(
        `SELECT id, journey_type, anonymous_id, status, started_at, completed_at
         FROM journey_sessions ORDER BY started_at DESC LIMIT 50`
      ).all<Record<string, any>>(),
      db.prepare(
        `SELECT anonymous_id, preferences_json, updated_at
         FROM coffee_profiles ORDER BY updated_at DESC LIMIT 30`
      ).all<Record<string, any>>()
    ]);

    return {
      connected: true,
      summary: summary.results ?? [],
      recent: recent.results ?? [],
      profiles: (profiles.results ?? []).map((item) => {
        let profile: Record<string, any> = {};
        try { profile = JSON.parse(item.preferences_json || '{}'); } catch { profile = {}; }
        return {
          anonymous_id: String(item.anonymous_id ?? ''),
          updated_at: String(item.updated_at ?? ''),
          profile
        };
      })
    };
  } catch {
    return { connected: true, summary: [], recent: [], profiles: [] };
  }
};
