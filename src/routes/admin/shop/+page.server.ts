import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';

export const load: PageServerLoad = async ({ cookies, platform, fetch }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');

  const rawUrl = platform?.env?.MEDUSA_BACKEND_URL;
  const backendUrl = typeof rawUrl === 'string' ? rawUrl.replace(/\/$/, '') : '';

  if (!backendUrl) {
    return { configured: false, reachable: false, backendUrl: '' };
  }

  try {
    const response = await fetch(backendUrl + '/health', {
      headers: { 'User-Agent': 'EL.SEED-Admin/1.0' }
    });
    return { configured: true, reachable: response.ok, backendUrl };
  } catch {
    return { configured: true, reachable: false, backendUrl };
  }
};
