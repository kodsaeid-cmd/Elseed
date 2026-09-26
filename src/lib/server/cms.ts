import { magazineArticles, type MagazineArticle } from '$lib/magazine';

export type CmsArticleRow = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  excerpt: string;
  reading_time: string;
  cover_image: string;
  cover_alt: string;
  content_json: string;
  takeaway: string;
  cta_json: string;
  status: 'draft' | 'published' | 'archived';
  featured: number;
  meta_title: string;
  meta_description: string;
  canonical_url: string;
  robots: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function displayDate(value: string | null) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  try {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch {
    return value.slice(0, 10);
  }
}

function rowToArticle(row: CmsArticleRow): MagazineArticle {
  let content: { quickAnswer?: string; sections?: MagazineArticle['sections'] } = {};
  let cta: MagazineArticle['cta'] | undefined;

  try {
    content = JSON.parse(row.content_json || '{}');
  } catch {
    content = {};
  }

  try {
    const parsed = JSON.parse(row.cta_json || '{}');
    if (parsed && typeof parsed === 'object' && parsed.label && parsed.href) {
      cta = parsed;
    }
  } catch {
    cta = undefined;
  }

  const publishedIso = row.published_at?.slice(0, 10) || row.created_at.slice(0, 10);

  return {
    slug: row.slug,
    title: row.title,
    eyebrow: row.eyebrow,
    category: row.category,
    excerpt: row.excerpt,
    meta: row.reading_time,
    publishedAt: displayDate(row.published_at || row.created_at),
    publishedIso,
    updatedIso: row.updated_at.slice(0, 10),
    image: row.cover_image,
    imageAlt: row.cover_alt,
    featured: Boolean(row.featured),
    quickAnswer: content.quickAnswer,
    sections: Array.isArray(content.sections) ? content.sections : [],
    takeaway: row.takeaway,
    cta
  };
}

function fallbackArticleToRow(article: MagazineArticle, index: number): CmsArticleRow {
  const iso = article.publishedIso + 'T09:00:00Z';
  return {
    id: 'starter-' + (index + 1),
    slug: article.slug,
    title: article.title,
    eyebrow: article.eyebrow,
    category: article.category,
    excerpt: article.excerpt,
    reading_time: article.meta,
    cover_image: article.image,
    cover_alt: article.imageAlt,
    content_json: JSON.stringify({
      quickAnswer: article.quickAnswer ?? '',
      sections: article.sections
    }),
    takeaway: article.takeaway,
    cta_json: JSON.stringify(article.cta ?? {}),
    status: 'published',
    featured: article.featured ? 1 : 0,
    meta_title: article.title + ' | مجله EL.SEED',
    meta_description: article.excerpt,
    canonical_url: '/magazine/' + article.slug,
    robots: 'index,follow',
    published_at: iso,
    created_at: iso,
    updated_at: iso
  };
}

export async function ensureCmsSeed(db?: ElseedD1Database) {
  if (!db) return;

  try {
    const count = await db.prepare('SELECT COUNT(*) AS count FROM cms_articles').first<{ count: number }>();
    if ((count?.count ?? 0) > 0) return;

    for (let index = 0; index < magazineArticles.length; index += 1) {
      const row = fallbackArticleToRow(magazineArticles[index], index);
      await db
        .prepare(
          `INSERT OR IGNORE INTO cms_articles
          (id, slug, title, eyebrow, category, excerpt, reading_time, cover_image, cover_alt,
           content_json, takeaway, cta_json, status, featured, meta_title, meta_description,
           canonical_url, robots, published_at, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          row.id,
          row.slug,
          row.title,
          row.eyebrow,
          row.category,
          row.excerpt,
          row.reading_time,
          row.cover_image,
          row.cover_alt,
          row.content_json,
          row.takeaway,
          row.cta_json,
          row.status,
          row.featured,
          row.meta_title,
          row.meta_description,
          row.canonical_url,
          row.robots,
          row.published_at,
          row.created_at,
          row.updated_at
        )
        .run();
    }
  } catch {
    // Migration may not be applied yet. Public pages keep their static fallback.
  }
}

export async function getPublishedArticles(db?: ElseedD1Database) {
  if (!db) return magazineArticles;

  try {
    const result = await db
      .prepare(
        `SELECT * FROM cms_articles
         WHERE status = 'published'
         ORDER BY featured DESC, COALESCE(published_at, created_at) DESC`
      )
      .all<CmsArticleRow>();

    if (!result.results?.length) return magazineArticles;
    return result.results.map(rowToArticle);
  } catch {
    return magazineArticles;
  }
}

export async function getPublishedArticle(db: ElseedD1Database | undefined, slug: string) {
  if (db) {
    try {
      const row = await db
        .prepare(`SELECT * FROM cms_articles WHERE slug = ? AND status = 'published' LIMIT 1`)
        .bind(slug)
        .first<CmsArticleRow>();
      if (row) return rowToArticle(row);
    } catch {
      // Static fallback below.
    }
  }

  return magazineArticles.find((article) => article.slug === slug);
}

export async function getAdminArticles(db?: ElseedD1Database) {
  if (!db) return magazineArticles.map(fallbackArticleToRow);

  await ensureCmsSeed(db);

  try {
    const result = await db
      .prepare(
        `SELECT * FROM cms_articles
         ORDER BY CASE status WHEN 'draft' THEN 0 WHEN 'published' THEN 1 ELSE 2 END,
                  updated_at DESC`
      )
      .all<CmsArticleRow>();
    return result.results ?? [];
  } catch {
    return magazineArticles.map(fallbackArticleToRow);
  }
}

export async function getAdminArticle(db: ElseedD1Database | undefined, id: string) {
  if (!db) return null;
  await ensureCmsSeed(db);
  return db.prepare('SELECT * FROM cms_articles WHERE id = ? LIMIT 1').bind(id).first<CmsArticleRow>();
}

export function articleFromRow(row: CmsArticleRow) {
  return rowToArticle(row);
}
