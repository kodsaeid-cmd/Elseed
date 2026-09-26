import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { ensureCmsSchema } from '$lib/server/cms';

const defaults = {
  siteTitle: 'EL.SEED',
  tagline: 'GOOD COFFEE. BETTER DAYS.',
  defaultMetaDescription: 'قهوه برای آدم‌ها، نه اصطلاحات پیچیده.',
  supportEmail: '',
  instagram: '',
  defaultOgImage: ''
};

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
  const db = platform?.env?.DB;
  if (!db) return { connected: false, settings: defaults };

  await ensureCmsSchema(db);
  try {
    const row = await db.prepare(
      `SELECT value_json FROM cms_site_settings WHERE key = 'site' LIMIT 1`
    ).first<{ value_json: string }>();

    return {
      connected: true,
      settings: row?.value_json ? { ...defaults, ...JSON.parse(row.value_json) } : defaults
    };
  } catch {
    return { connected: true, settings: defaults };
  }
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    await ensureCmsSchema(db);
    const form = await request.formData();
    const settings = {
      siteTitle: String(form.get('siteTitle') ?? '').trim().slice(0, 120),
      tagline: String(form.get('tagline') ?? '').trim().slice(0, 240),
      defaultMetaDescription: String(form.get('defaultMetaDescription') ?? '').trim().slice(0, 500),
      supportEmail: String(form.get('supportEmail') ?? '').trim().slice(0, 254),
      instagram: String(form.get('instagram') ?? '').trim().slice(0, 500),
      defaultOgImage: String(form.get('defaultOgImage') ?? '').trim().slice(0, 1000)
    };

    await db.prepare(
      `INSERT INTO cms_site_settings (key, value_json, updated_at)
       VALUES ('site', ?, datetime('now'))
       ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = datetime('now')`
    ).bind(JSON.stringify(settings)).run();

    return { success: true, message: 'تنظیمات ذخیره شد.' };
  }
};
