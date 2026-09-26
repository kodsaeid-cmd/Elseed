import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { createAdminArticle, ensureCmsSeed, parseArticleForm } from '$lib/server/cms';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    throw redirect(303, '/admin/login');
  }
  if (platform?.env?.DB) await ensureCmsSeed(platform.env.DB);
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) {
      throw redirect(303, '/admin/login');
    }

    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    let id: string;

    try {
      const input = parseArticleForm(await request.formData());
      id = await createAdminArticle(db, input);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ذخیره مقاله انجام نشد.';
      return fail(400, { error: message });
    }

    throw redirect(303, '/admin/magazine/' + id);
  }
};
