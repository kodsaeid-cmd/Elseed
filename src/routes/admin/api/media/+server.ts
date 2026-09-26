import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { isAdminAuthenticated } from '$lib/server/adminAuth';
import { ensureCmsSchema } from '$lib/server/cms';
import {
  extensionFor,
  getMediaAsset,
  listArticleMedia,
  listMediaAssets,
  mediaStorageStatus,
  publicMediaUrl,
  safeMediaType,
  uploadLimit
} from '$lib/server/media';

function clean(value: unknown, max = 1000) {
  return typeof value === 'string' ? value.replace(/\u0000/g, '').trim().slice(0, max) : '';
}

function int(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

async function requireAdmin(
  cookies: Parameters<RequestHandler>[0]['cookies'],
  platform?: App.Platform
): Promise<{ db: ElseedD1Database } | Response> {
  if (!(await isAdminAuthenticated(cookies, platform))) {
    return json({ error: 'دسترسی مدیر الزامی است.' }, { status: 401 });
  }

  const db = platform?.env?.DB;
  if (!db) {
    return json({ error: 'D1 در دسترس نیست.' }, { status: 503 });
  }

  await ensureCmsSchema(db);
  return { db };
}

export const GET: RequestHandler = async ({ cookies, platform, url }) => {
  const auth = await requireAdmin(cookies, platform);
  if (auth instanceof Response) return auth;

  const articleId = clean(url.searchParams.get('articleId'), 140);
  const [assets, placements] = await Promise.all([
    listMediaAssets(auth.db, 250),
    articleId ? listArticleMedia(auth.db, articleId) : Promise.resolve([])
  ]);

  return json(
    {
      assets,
      placements,
      storage: mediaStorageStatus(platform),
      directUploadEnabled: Boolean(platform?.env?.MEDIA)
    },
    { headers: { 'cache-control': 'no-store' } }
  );
};

export const POST: RequestHandler = async ({ request, cookies, platform }) => {
  const auth = await requireAdmin(cookies, platform);
  if (auth instanceof Response) return auth;

  const contentType = request.headers.get('content-type') || '';

  try {
    if (contentType.includes('multipart/form-data')) {
      const bucket = platform?.env?.MEDIA;
      if (!bucket) {
        return json(
          {
            error:
              'فضای آپلود مستقیم هنوز فعال نیست. Cloudflare R2 باید یک‌بار روی حساب فعال و binding MEDIA متصل شود.'
          },
          { status: 503 }
        );
      }

      const form = await request.formData();
      const file = form.get('file');
      const alt = clean(form.get('alt'), 500);

      if (!(file instanceof File)) {
        return json({ error: 'فایل انتخاب نشده است.' }, { status: 400 });
      }

      const mediaType = safeMediaType(file.type, file.name);
      if (!mediaType) {
        return json(
          { error: 'فرمت مجاز نیست. تصویر: JPG/PNG/WebP/AVIF/GIF — ویدئو: MP4/WebM.' },
          { status: 400 }
        );
      }

      if (file.size <= 0 || file.size > uploadLimit(mediaType)) {
        return json(
          { error: mediaType === 'video' ? 'ویدئو باید حداکثر ۵۰MB باشد.' : 'تصویر باید حداکثر ۱۰MB باشد.' },
          { status: 413 }
        );
      }

      const id = crypto.randomUUID();
      const ext = extensionFor(file, mediaType);
      const now = new Date();
      const key = `articles/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}/${id}.${ext}`;
      const bytes = await file.arrayBuffer();

      await bucket.put(key, bytes, {
        httpMetadata: {
          contentType: file.type || (mediaType === 'video' ? 'video/mp4' : 'image/jpeg'),
          cacheControl: 'public, max-age=31536000, immutable'
        },
        customMetadata: {
          originalName: file.name.slice(0, 240),
          mediaType
        }
      });

      const publicUrl = publicMediaUrl(id);
      const result = await auth.db
        .prepare(
          `INSERT INTO cms_media_assets
           (id,name,url,alt_text,mime_type,source,object_key,media_type,size_bytes,created_at,updated_at)
           VALUES (?,?,?,?,?,'r2',?,?,?,datetime('now'),datetime('now'))`
        )
        .bind(
          id,
          file.name.slice(0, 240),
          publicUrl,
          alt || file.name.replace(/\.[^.]+$/, ''),
          file.type || '',
          key,
          mediaType,
          file.size
        )
        .run();

      if (result.success === false) {
        await bucket.delete(key);
        throw new Error(result.error || 'ثبت فایل انجام نشد.');
      }

      const asset = await getMediaAsset(auth.db, id);
      return json({ ok: true, asset, mediaId: id, publicUrl }, { status: 201 });
    }

    const body = await request.json();
    const action = clean(body?.action, 60);

    if (action === 'add_external_asset') {
      const rawUrl = clean(body?.url, 1500);
      let parsed: URL;
      try {
        parsed = new URL(rawUrl);
      } catch {
        return json({ error: 'URL رسانه معتبر نیست.' }, { status: 400 });
      }
      if (parsed.protocol !== 'https:') {
        return json({ error: 'فقط URL امن https مجاز است.' }, { status: 400 });
      }

      const mediaType = clean(body?.mediaType, 20);
      if (mediaType !== 'image' && mediaType !== 'video') {
        return json({ error: 'نوع رسانه معتبر نیست.' }, { status: 400 });
      }

      const id = crypto.randomUUID();
      const name = clean(body?.name, 240) || decodeURIComponent(parsed.pathname.split('/').pop() || 'رسانه خارجی');
      const alt = clean(body?.alt, 500);

      const result = await auth.db
        .prepare(
          `INSERT INTO cms_media_assets
           (id,name,url,alt_text,mime_type,source,object_key,media_type,size_bytes,created_at,updated_at)
           VALUES (?,?,?,?,?,'external',?,?,0,datetime('now'),datetime('now'))`
        )
        .bind(id, name, parsed.toString(), alt, mediaType + '/external', 'external:' + id, mediaType)
        .run();

      if (result.success === false) throw new Error(result.error || 'ثبت رسانه انجام نشد.');
      return json({ ok: true, asset: await getMediaAsset(auth.db, id) }, { status: 201 });
    }

    if (action === 'attach_to_article') {
      const articleId = clean(body?.articleId, 140);
      const mediaId = clean(body?.mediaId, 140);
      if (!articleId || !mediaId) return json({ error: 'مطلب و رسانه را انتخاب کنید.' }, { status: 400 });

      const [article, media] = await Promise.all([
        auth.db.prepare('SELECT id FROM cms_articles WHERE id=? LIMIT 1').bind(articleId).first(),
        getMediaAsset(auth.db, mediaId)
      ]);
      if (!article || !media) return json({ error: 'مطلب یا رسانه پیدا نشد.' }, { status: 404 });

      const id = crypto.randomUUID();
      const afterParagraph = Math.max(0, Math.min(999, int(body?.afterParagraph, 1)));
      const sortOrder = Math.max(0, Math.min(9999, int(body?.sortOrder, 0)));

      const result = await auth.db
        .prepare(
          `INSERT INTO cms_article_media
           (id,article_id,media_id,after_paragraph,caption,alt_text,sort_order)
           VALUES (?,?,?,?,?,?,?)`
        )
        .bind(
          id,
          articleId,
          mediaId,
          afterParagraph,
          clean(body?.caption, 500),
          clean(body?.alt, 500),
          sortOrder
        )
        .run();

      if (result.success === false) throw new Error(result.error || 'اتصال رسانه به مقاله انجام نشد.');
      return json({ ok: true, placements: await listArticleMedia(auth.db, articleId) });
    }

    if (action === 'remove_from_article') {
      const placementId = clean(body?.placementId, 140);
      if (!placementId) return json({ error: 'شناسه جایگذاری نامعتبر است.' }, { status: 400 });
      await auth.db.prepare('DELETE FROM cms_article_media WHERE id=?').bind(placementId).run();
      return json({ ok: true });
    }

    if (action === 'set_featured_media') {
      const articleId = clean(body?.articleId, 140);
      const mediaId = clean(body?.mediaId, 140);
      const media = await getMediaAsset(auth.db, mediaId);

      if (!articleId || !media || media.media_type !== 'image') {
        return json({ error: 'برای تصویر شاخص یک تصویر معتبر انتخاب کنید.' }, { status: 400 });
      }

      const alt = clean(body?.alt, 500) || media.alt_text || media.name;
      const result = await auth.db
        .prepare(
          `UPDATE cms_articles
           SET cover_image=?, cover_alt=?, updated_at=datetime('now')
           WHERE id=?`
        )
        .bind(media.url, alt, articleId)
        .run();

      if (result.success === false) throw new Error(result.error || 'تصویر شاخص تغییر نکرد.');
      return json({ ok: true, url: media.url, alt });
    }

    if (action === 'delete_asset') {
      const mediaId = clean(body?.mediaId, 140);
      const media = await getMediaAsset(auth.db, mediaId);
      if (!media) return json({ error: 'رسانه پیدا نشد.' }, { status: 404 });

      const usage = await auth.db
        .prepare('SELECT COUNT(*) AS count FROM cms_article_media WHERE media_id=?')
        .bind(mediaId)
        .first<{ count: number }>();

      if (Number(usage?.count || 0) > 0) {
        return json({ error: 'این رسانه داخل مقاله استفاده شده و فعلاً قابل حذف نیست.' }, { status: 409 });
      }

      if (media.source === 'r2' && media.object_key && platform?.env?.MEDIA) {
        await platform.env.MEDIA.delete(media.object_key);
      }

      await auth.db.prepare('DELETE FROM cms_media_assets WHERE id=?').bind(mediaId).run();
      return json({ ok: true });
    }

    return json({ error: 'عملیات نامعتبر است.' }, { status: 400 });
  } catch (caught) {
    console.error('[elseed:admin-media]', caught);
    const message = caught instanceof Error ? caught.message : 'عملیات رسانه انجام نشد.';
    return json({ error: message }, { status: 500 });
  }
};
