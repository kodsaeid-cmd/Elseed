import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import {
  createAdminArticle,
  getAdminArticles,
  parseArticleForm,
  setAdminArticleStatus
} from '$lib/server/cms';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }

  const articles = await getAdminArticles(platform?.env?.DB);
  return {
    articleOptions: articles.map((item) => ({ id: item.id, slug: item.slug, title: item.title }))
  };
};

async function requireDb(cookies: Cookies, platform?: App.Platform) {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }

  const db = platform?.env?.DB;
  if (!db) throw error(503, 'D1 در دسترس نیست.');
  return db;
}

export const actions: Actions = {
  draft: async ({ request, cookies, platform }) => {
    const db = await requireDb(cookies, platform);
    let id = '';

    try {
      const input = parseArticleForm(await request.formData());
      input.status = 'draft';
      id = await createAdminArticle(db, input);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'ساخت پیش‌نویس انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, `/admin/magazine/${id}?saved=draft`);
  },

  publish: async ({ request, cookies, platform }) => {
    const db = await requireDb(cookies, platform);
    let id = '';

    try {
      const input = parseArticleForm(await request.formData());

      // New articles are created as drafts first, then published with the same
      // verified status transition used by existing articles.
      input.status = 'draft';
      id = await createAdminArticle(db, input);
      await setAdminArticleStatus(db, id, 'published');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'انتشار مقاله انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, `/admin/magazine/${id}?saved=published`);
  }
};
