import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { listArticleMedia } from '$lib/server/media';

function clean(value: unknown, max = 1000) {
  return typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';
}

function int(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    return json({ error: 'دسترسی مدیر الزامی است.' }, { status: 401 });
  }

  const db = platform?.env?.DB;
  if (!db) return json({ error: 'D1 در دسترس نیست.' }, { status: 503 });

  try {
    const body = await request.json();
    const action = clean(body?.action, 60);

    if (action === 'update_placement') {
      const placementId = clean(body?.placementId, 140);
      if (!placementId) {
        return json({ error: 'شناسه رسانه نامعتبر است.' }, { status: 400 });
      }

      const placement = await db
        .prepare('SELECT id,article_id FROM cms_article_media WHERE id=? LIMIT 1')
        .bind(placementId)
        .first<{ id: string; article_id: string }>();

      if (!placement) {
        return json({ error: 'رسانه داخل مقاله پیدا نشد.' }, { status: 404 });
      }

      const afterParagraph = Math.max(0, Math.min(999, int(body?.afterParagraph, 1)));
      const sortOrder = Math.max(0, Math.min(9999, int(body?.sortOrder, 0)));

      const result = await db
        .prepare(
          `UPDATE cms_article_media
           SET after_paragraph=?, sort_order=?, alt_text=?, caption=?
           WHERE id=?`
        )
        .bind(
          afterParagraph,
          sortOrder,
          clean(body?.alt, 500),
          clean(body?.caption, 500),
          placementId
        )
        .run();

      if (result.success === false) {
        throw new Error(result.error || 'تنظیمات رسانه ذخیره نشد.');
      }

      return json({ ok: true, placements: await listArticleMedia(db, placement.article_id) });
    }

    return json({ error: 'عملیات نامعتبر است.' }, { status: 400 });
  } catch (caught) {
    console.error('[elseed:article-media]', caught);
    const message = caught instanceof Error ? caught.message : 'ویرایش چیدمان رسانه انجام نشد.';
    return json({ error: message }, { status: 500 });
  }
};
