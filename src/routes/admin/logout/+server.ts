import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logoutAdmin } from '$lib/server/adminAuth';

export const GET: RequestHandler = ({ cookies }) => {
  logoutAdmin(cookies);
  throw redirect(303, '/admin/login');
};
