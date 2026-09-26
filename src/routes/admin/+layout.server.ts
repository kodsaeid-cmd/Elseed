import type { LayoutServerLoad } from './$types';
import { isAdminAuthenticated, isAdminConfigured } from '$lib/server/adminAuth';

export const load: LayoutServerLoad = async ({ cookies, platform, url }) => {
  const configured = await isAdminConfigured(platform);
  const authenticated = await isAdminAuthenticated(cookies, platform);

  return {
    adminConfigured: configured,
    adminAuthenticated: authenticated,
    isLoginPage: url.pathname === '/admin/login'
  };
};
