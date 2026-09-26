import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { getAdminStories } from '$lib/server/coffeeStories';

function clean(form: FormData, key: string, max = 5000) {
  const value = form.get(key);
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

const allowedTypes = new Set(['historical','cultural','origin','people','invention','literary']);
const allowedStatuses = new Set(['draft','published','archived']);

export const load: PageServerLoad = async ({ cookies, platform, url }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
  const db = platform?.env?.DB;
  if (!db) return { connected: false, stories: [], selected: null };

  try {
    const stories = await getAdminStories(db);
    const selectedId = url.searchParams.get('edit') ?? '';
    return {
      connected: true,
      stories,
      selected: stories.find((item) => item.id === selectedId) ?? null
    };
  } catch {
    return { connected: true, stories: [], selected: null };
  }
};

export const actions: Actions = {
  save: async ({ request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    const form = await request.formData();
    const id = clean(form, 'id', 100) || crypto.randomUUID();
    const title = clean(form, 'title', 240);
    const slug = normalizeSlug(clean(form, 'slug', 180) || title);
    const storyTypeRaw = clean(form, 'story_type', 40);
    const storyType = allowedTypes.has(storyTypeRaw) ? storyTypeRaw : 'literary';
    const statusRaw = clean(form, 'status', 30);
    const status = allowedStatuses.has(statusRaw) ? statusRaw : 'draft';
    const storyText = clean(form, 'story_text', 12000);

    if (!title || !slug || !storyText) {
      return fail(400, { error: 'عنوان، Slug و متن داستان لازم است.' });
    }

    const values = {
      id,
      slug,
      title,
      kicker: clean(form, 'kicker', 160) || 'داستان امروز',
      excerpt: clean(form, 'excerpt', 1200),
      storyText,
      lesson: clean(form, 'lesson', 2000),
      storyType,
      era: clean(form, 'era', 160),
      place: clean(form, 'place', 160),
      imageUrl: clean(form, 'image_url', 1000),
      sourceLabel: clean(form, 'source_label', 300),
      sourceUrl: clean(form, 'source_url', 1200),
      isFactual: form.get('is_factual') === 'on' ? 1 : 0,
      status,
      featured: form.get('featured') === 'on' ? 1 : 0
    };

    try {
      await db.prepare(
        `INSERT INTO coffee_stories
          (id, slug, title, kicker, excerpt, story_text, lesson, story_type, era, place,
           image_url, source_label, source_url, is_factual, status, featured, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
         ON CONFLICT(id) DO UPDATE SET
           slug = excluded.slug,
           title = excluded.title,
           kicker = excluded.kicker,
           excerpt = excluded.excerpt,
           story_text = excluded.story_text,
           lesson = excluded.lesson,
           story_type = excluded.story_type,
           era = excluded.era,
           place = excluded.place,
           image_url = excluded.image_url,
           source_label = excluded.source_label,
           source_url = excluded.source_url,
           is_factual = excluded.is_factual,
           status = excluded.status,
           featured = excluded.featured,
           updated_at = datetime('now')`
      )
      .bind(
        values.id,
        values.slug,
        values.title,
        values.kicker,
        values.excerpt,
        values.storyText,
        values.lesson,
        values.storyType,
        values.era,
        values.place,
        values.imageUrl,
        values.sourceLabel,
        values.sourceUrl,
        values.isFactual,
        values.status,
        values.featured
      )
      .run();
    } catch (error: any) {
      const message = String(error?.message ?? '');
      return fail(400, {
        error: message.includes('UNIQUE') ? 'Slug تکراری است.' : 'ذخیره داستان انجام نشد.'
      });
    }

    throw redirect(303, '/admin/stories?edit=' + encodeURIComponent(id) + '&saved=1');
  },

  delete: async ({ request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    const form = await request.formData();
    const id = clean(form, 'id', 100);
    if (!id) return fail(400, { error: 'Story ID نامعتبر است.' });

    await db.prepare('DELETE FROM coffee_stories WHERE id = ?').bind(id).run();
    throw redirect(303, '/admin/stories?deleted=1');
  },

  toggle: async ({ request, cookies, platform }) => {
    if (!(await isAdminAuthenticated(cookies, platform))) throw redirect(303, '/admin/login');
    const db = platform?.env?.DB;
    if (!db) return fail(503, { error: 'D1 در دسترس نیست.' });

    const form = await request.formData();
    const id = clean(form, 'id', 100);
    const next = clean(form, 'next', 30);
    if (!id || !allowedStatuses.has(next)) return fail(400, { error: 'درخواست نامعتبر است.' });

    await db
      .prepare('UPDATE coffee_stories SET status = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .bind(next, id)
      .run();

    throw redirect(303, '/admin/stories?edit=' + encodeURIComponent(id));
  }
};
