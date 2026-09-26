import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
  const db = platform?.env?.DB;
  if (!db) return { connected: false, subscribers: [] };

  try {
    const result = await db.prepare(
      `SELECT email, status, source, consented_at, created_at, updated_at
       FROM newsletter_subscribers ORDER BY updated_at DESC LIMIT 200`
    ).all<Record<string, any>>();
    return { connected: true, subscribers: result.results ?? [] };
  } catch {
    return { connected: true, subscribers: [] };
  }
};
