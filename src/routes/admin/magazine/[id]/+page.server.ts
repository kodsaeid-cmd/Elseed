import { error, fail, redirect } from '@sveltejs/kit';
import type { Cookies } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import {
  deleteAdminArticle,
  getAdminArticle,
  getAdminArticles,
  parseArticleForm,
  setAdminArticleStatus,
  updateAdminArticle
} from '$lib/server/cms';

export const load: PageServerLoad = async ({ params, cookies, platform, url }) => {
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
    saved: url.searchParams.get('saved') ?? '',
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
  draft: async ({ params, request, cookies, platform }) => {
    const db = await requireDb(cookies, platform);

    try {
      const input = parseArticleForm(await request.formData());
      input.status = 'draft';
      await updateAdminArticle(db, params.id, input);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'ذخیره پیش‌نویس انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, `/admin/magazine/${params.id}?saved=draft`);
  },

  publish: async ({ params, request, cookies, platform }) => {
    const db = await requireDb(cookies, platform);

    try {
      // First persist the full editor payload through the already-proven draft path.
      const input = parseArticleForm(await request.formData());
      input.status = 'draft';
      await updateAdminArticle(db, params.id, input);

      // Then perform publication as a small, isolated, verified status transition.
      await setAdminArticleStatus(db, params.id, 'published');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'انتشار مقاله انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, `/admin/magazine/${params.id}?saved=published`);
  },

  archive: async ({ params, cookies, platform }) => {
    const db = await requireDb(cookies, platform);

    try {
      await setAdminArticleStatus(db, params.id, 'archived');
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'آرشیو مقاله انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, `/admin/magazine/${params.id}?saved=archived`);
  },

  delete: async ({ params, cookies, platform }) => {
    const db = await requireDb(cookies, platform);

    try {
      await deleteAdminArticle(db, params.id);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'حذف مقاله انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, '/admin/magazine');
  }
};
