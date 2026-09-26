import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { getAdminArticles } from '$lib/server/cms';

export const load: PageServerLoad = async ({ cookies, platform, url }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }

  const db = platform?.env?.DB;
  const status = url.searchParams.get('status') ?? 'all';
  const articles = await getAdminArticles(db);

  return {
    status,
    articles:
      status === 'all'
        ? articles
        : articles.filter((article) => article.status === status)
  };
};
