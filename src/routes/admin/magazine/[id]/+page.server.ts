import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import {
  deleteAdminArticle,
  getAdminArticle,
  getAdminArticles,
  parseArticleForm,
  updateAdminArticle
} from '$lib/server/cms';

export const load: PageServerLoad = async ({ params, cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }

  const db = platform?.env?.DB;
  if (!db) throw error(503, 'D1 در دسترس نیست.');

  const article = await getAdminArticle(db, params.id);
  if (!article) throw error(404, 'مقاله پیدا نشد.');

  const articles = await getAdminArticles(db);
  return {
    article,
    articleOptions: articles.map((item) => ({ id: item.id, slug: item.slug, title: item.title }))
  };
};

export const actions: Actions = {
  default: async ({ params, request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) {
      throw redirect(303, '/admin/login');
    }

    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    try {
      const input = parseArticleForm(await request.formData());
      await updateAdminArticle(db, params.id, input);
      return { success: true, message: 'تغییرات ذخیره شد.' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ذخیره تغییرات انجام نشد.';
      return fail(400, { error: message });
    }
  },

  delete: async ({ params, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) {
      throw redirect(303, '/admin/login');
    }

    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    await deleteAdminArticle(db, params.id);
    throw redirect(303, '/admin/magazine');
  }
};
