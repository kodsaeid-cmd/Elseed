import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { getAdminArticles } from '$lib/server/cms';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');

  const articles = await getAdminArticles(platform?.env?.DB);

  return {
    articles,
    summary: {
      total: articles.length,
      missingTitle: articles.filter((a) => !a.meta_title).length,
      missingDescription: articles.filter((a) => !a.meta_description).length,
      noindex: articles.filter((a) => a.robots?.includes('noindex')).length
    }
  };
};
