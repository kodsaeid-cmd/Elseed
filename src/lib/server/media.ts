export type CmsMediaAsset = {
  id: string;
  name: string;
  url: string;
  alt_text: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  source: string;
  object_key: string;
  media_type: 'image' | 'video';
  size_bytes: number;
  created_at: string;
  updated_at: string;
};

export type CmsArticleMediaPlacement = CmsMediaAsset & {
  placement_id: string;
  article_id: string;
  media_id: string;
  after_paragraph: number;
  caption: string;
  placement_alt: string;
  sort_order: number;
};

export function mediaStorageStatus(platform?: App.Platform) {
  return {
    configured: Boolean(platform?.env?.MEDIA),
    provider: 'Cloudflare R2',
    binding: 'MEDIA'
  };
}

export async function listMediaAssets(db: ElseedD1Database, limit = 200) {
  try {
    const result = await db
      .prepare(
        `SELECT id,name,url,alt_text,mime_type,width,height,source,object_key,media_type,size_bytes,created_at,updated_at
         FROM cms_media_assets
         ORDER BY created_at DESC
         LIMIT ?`
      )
      .bind(Math.max(1, Math.min(limit, 500)))
      .all<CmsMediaAsset>();
    return result.results ?? [];
  } catch {
    return [];
  }
}

export async function getMediaAsset(db: ElseedD1Database, id: string) {
  return db
    .prepare(
      `SELECT id,name,url,alt_text,mime_type,width,height,source,object_key,media_type,size_bytes,created_at,updated_at
       FROM cms_media_assets WHERE id=? LIMIT 1`
    )
    .bind(id)
    .first<CmsMediaAsset>();
}

export async function listArticleMedia(db: ElseedD1Database, articleId: string) {
  try {
    const result = await db
      .prepare(
        `SELECT
          p.id AS placement_id,
          p.article_id,
          p.media_id,
          p.after_paragraph,
          p.caption,
          p.alt_text AS placement_alt,
          p.sort_order,
          m.id,
          m.name,
          m.url,
          m.alt_text,
          m.mime_type,
          m.width,
          m.height,
          m.source,
          m.object_key,
          m.media_type,
          m.size_bytes,
          m.created_at,
          m.updated_at
         FROM cms_article_media p
         JOIN cms_media_assets m ON m.id = p.media_id
         WHERE p.article_id=?
         ORDER BY p.after_paragraph ASC, p.sort_order ASC, p.created_at ASC`
      )
      .bind(articleId)
      .all<CmsArticleMediaPlacement>();
    return result.results ?? [];
  } catch {
    return [];
  }
}

export async function listPublicArticleMedia(db: ElseedD1Database | undefined, articleId: string) {
  if (!db) return [];
  return listArticleMedia(db, articleId);
}

export function safeMediaType(mime: string, filename = ''): 'image' | 'video' | null {
  const normalized = mime.toLowerCase();
  const name = filename.toLowerCase();
  const image =
    normalized === 'image/jpeg' ||
    normalized === 'image/png' ||
    normalized === 'image/webp' ||
    normalized === 'image/avif' ||
    normalized === 'image/gif';
  const video = normalized === 'video/mp4' || normalized === 'video/webm';

  if (image) return 'image';
  if (video) return 'video';

  if (/\.(jpe?g|png|webp|avif|gif)$/.test(name)) return 'image';
  if (/\.(mp4|webm)$/.test(name)) return 'video';
  return null;
}

export function uploadLimit(mediaType: 'image' | 'video') {
  return mediaType === 'video' ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
}

export function extensionFor(file: File, mediaType: 'image' | 'video') {
  const byMime: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/avif': 'avif',
    'image/gif': 'gif',
    'video/mp4': 'mp4',
    'video/webm': 'webm'
  };
  const mimeExt = byMime[file.type.toLowerCase()];
  if (mimeExt) return mimeExt;

  const match = file.name.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] || (mediaType === 'video' ? 'mp4' : 'jpg');
}

export function publicMediaUrl(id: string) {
  return '/media/library/' + encodeURIComponent(id);
}
