import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { authenticateAdmin, isAdminAuthenticated, isAdminConfigured } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ cookies, platform }) => {
  if (await isAdminAuthenticated(cookies, platform)) {
    throw redirect(303, '/admin');
  }

  return {
    configured: await isAdminConfigured(platform)
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
    const form = await request.formData();
    const password = String(form.get('password') ?? '');

    if (!(await isAdminConfigured(platform))) {
      return fail(503, {
        error: 'رمز ادمین روی محیط سرور تنظیم نشده است.'
      });
    }

    if (!(await authenticateAdmin(password, cookies, platform))) {
      return fail(401, {
        error: 'رمز واردشده درست نیست.'
      });
    }

    throw redirect(303, '/admin');
  }
};
