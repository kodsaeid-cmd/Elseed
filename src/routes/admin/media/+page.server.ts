import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { ensureCmsSchema } from '$lib/server/cms';

async function requireAdmin(cookies: any, platform?: App.Platform) {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
}

export const load: PageServerLoad = async ({ cookies, platform }) => {
  await requireAdmin(cookies, platform);
  const db = platform?.env?.DB;
  if (!db) return { connected: false, assets: [] };

  await ensureCmsSchema(db);
  try {
    const result = await db.prepare(
      `SELECT id, name, url, alt_text, mime_type, width, height, source, created_at
       FROM cms_media_assets ORDER BY created_at DESC LIMIT 200`
    ).all<Record<string, any>>();
    return { connected: true, assets: result.results ?? [] };
  } catch {
    return { connected: true, assets: [] };
  }
};

export const actions: Actions = {
  add: async ({ request, cookies, platform }) => {
    await requireAdmin(cookies, platform);
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    await ensureCmsSchema(db);
    const form = await request.formData();
    const name = String(form.get('name') ?? '').trim().slice(0, 200);
    const url = String(form.get('url') ?? '').trim().slice(0, 1500);
    const alt = String(form.get('alt_text') ?? '').trim().slice(0, 500);

    if (!name || !url) return fail(400, { error: 'نام و URL تصویر لازم است.' });

    const result = await db.prepare(
      `INSERT INTO cms_media_assets
       (id, name, url, alt_text, source, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'external', datetime('now'), datetime('now'))`
    ).bind(crypto.randomUUID(), name, url, alt).run();

    if (result.success === false) return fail(400, { error: result.error || 'ثبت تصویر انجام نشد.' });
    return { success: true, message: 'تصویر به Media Library اضافه شد.' };
  },

  delete: async ({ request, cookies, platform }) => {
    await requireAdmin(cookies, platform);
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    const form = await request.formData();
    const id = String(form.get('id') ?? '');
    if (id) await db.prepare('DELETE FROM cms_media_assets WHERE id = ?').bind(id).run();
    return { success: true, message: 'رکورد مدیا حذف شد.' };
  }
};
