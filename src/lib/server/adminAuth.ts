import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'elseed_admin';

function getAdminPassword(platform?: App.Platform) {
  const value = platform?.env?.ADMIN_PASSWORD;
  return typeof value === 'string' ? value : '';
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(hash))
    .map((part) => part.toString(16).padStart(2, '0'))
    .join('');
}

async function expectedToken(platform?: App.Platform) {
  const password = getAdminPassword(platform);
  if (!password) return '';
  return digest('elseed-admin-session:v1:' + password);
}

export async function isAdminConfigured(platform?: App.Platform) {
  return Boolean(getAdminPassword(platform));
}

export async function isAdminAuthenticated(cookies: Cookies, platform?: App.Platform) {
  const expected = await expectedToken(platform);
  if (!expected) return false;
  const actual = cookies.get(COOKIE_NAME) ?? '';
  return actual === expected;
}

export async function authenticateAdmin(password: string, cookies: Cookies, platform?: App.Platform) {
  const configuredPassword = getAdminPassword(platform);
  if (!configuredPassword || password !== configuredPassword) return false;

  cookies.set(COOKIE_NAME, await expectedToken(platform), {
    path: '/admin',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60 * 12
  });

  return true;
}

export function logoutAdmin(cookies: Cookies) {
  cookies.delete(COOKIE_NAME, {
    path: '/admin',
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
}
