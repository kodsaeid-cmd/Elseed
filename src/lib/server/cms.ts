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
  let content: {
    quickAnswer?: string;
    sections?: MagazineArticle['sections'];
    faq?: MagazineArticle['faq'];
    relatedSlugs?: string[];
    internalLinks?: MagazineArticle['internalLinks'];
  } = {};
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
    id: row.id,
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
    faq: Array.isArray(content.faq) ? content.faq : [],
    relatedSlugs: Array.isArray(content.relatedSlugs) ? content.relatedSlugs : [],
    internalLinks: Array.isArray(content.internalLinks) ? content.internalLinks : [],
    cta,
    seo: {
      metaTitle: row.meta_title,
      metaDescription: row.meta_description,
      canonicalUrl: row.canonical_url,
      robots: row.robots
    }
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
      sections: article.sections,
      faq: article.faq ?? [],
      relatedSlugs: article.relatedSlugs ?? [],
      internalLinks: article.internalLinks ?? []
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

export async function ensureCmsSchema(db?: ElseedD1Database) {
  if (!db) return false;

  const statements = [
    `CREATE TABLE IF NOT EXISTS cms_articles (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      eyebrow TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      excerpt TEXT NOT NULL DEFAULT '',
      reading_time TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      cover_alt TEXT NOT NULL DEFAULT '',
      content_json TEXT NOT NULL DEFAULT '{"sections":[]}',
      takeaway TEXT NOT NULL DEFAULT '',
      cta_json TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'draft',
      featured INTEGER NOT NULL DEFAULT 0,
      meta_title TEXT NOT NULL DEFAULT '',
      meta_description TEXT NOT NULL DEFAULT '',
      canonical_url TEXT NOT NULL DEFAULT '',
      robots TEXT NOT NULL DEFAULT 'index,follow',
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS cms_article_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      article_id TEXT NOT NULL,
      snapshot_json TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS cms_media_assets (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      alt_text TEXT NOT NULL DEFAULT '',
      mime_type TEXT NOT NULL DEFAULT '',
      width INTEGER,
      height INTEGER,
      source TEXT NOT NULL DEFAULT 'external',
      object_key TEXT NOT NULL DEFAULT '',
      media_type TEXT NOT NULL DEFAULT 'image',
      size_bytes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS cms_article_media (
      id TEXT PRIMARY KEY,
      article_id TEXT NOT NULL,
      media_id TEXT NOT NULL,
      after_paragraph INTEGER NOT NULL DEFAULT 1,
      caption TEXT NOT NULL DEFAULT '',
      alt_text TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS cms_site_settings (
      key TEXT PRIMARY KEY,
      value_json TEXT NOT NULL DEFAULT '{}',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS cms_audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      payload_json TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`
  ];

  try {
    for (const statement of statements) {
      await db.prepare(statement).run();
    }
    return true;
  } catch {
    return false;
  }
}

export async function ensureCmsSeed(db?: ElseedD1Database) {
  if (!db) return;

  await ensureCmsSchema(db);

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

async function hydrateArticleImages(
  db: ElseedD1Database,
  articles: MagazineArticle[]
) {
  const missing = articles.filter((article) => !article.image?.trim() && article.id);
  if (!missing.length) return articles;

  try {
    const result = await db
      .prepare(
        `SELECT
          p.article_id,
          m.url,
          COALESCE(NULLIF(p.alt_text, ''), NULLIF(m.alt_text, ''), m.name) AS alt_text,
          p.after_paragraph,
          p.sort_order,
          p.created_at
         FROM cms_article_media p
         JOIN cms_media_assets m ON m.id = p.media_id
         WHERE m.media_type = 'image'
         ORDER BY p.article_id ASC, p.after_paragraph ASC, p.sort_order ASC, p.created_at ASC`
      )
      .all<{ article_id: string; url: string; alt_text: string }>();

    const firstImageByArticle = new Map<string, { url: string; alt: string }>();
    for (const item of result.results ?? []) {
      if (!firstImageByArticle.has(item.article_id) && item.url) {
        firstImageByArticle.set(item.article_id, {
          url: item.url,
          alt: item.alt_text || ''
        });
      }
    }

    return articles.map((article) => {
      if (article.image?.trim() || !article.id) return article;
      const fallback = firstImageByArticle.get(article.id);
      if (!fallback) return article;

      return {
        ...article,
        image: fallback.url,
        imageAlt: article.imageAlt || fallback.alt || article.title
      };
    });
  } catch {
    return articles;
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
    return hydrateArticleImages(db, result.results.map(rowToArticle));
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
      if (row) {
        const [article] = await hydrateArticleImages(db, [rowToArticle(row)]);
        return article;
      }
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


export type CmsArticleInput = {
  slug: string;
  title: string;
  eyebrow: string;
  category: string;
  excerpt: string;
  readingTime: string;
  coverImage: string;
  coverAlt: string;
  contentJson: string;
  takeaway: string;
  ctaJson: string;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  robots: string;
};

function cleanText(value: FormDataEntryValue | null, max = 5000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export function parseArticleForm(form: FormData): CmsArticleInput {
  const slug = cleanText(form.get('slug'), 160).toLowerCase();
  const title = cleanText(form.get('title'), 240);
  const statusValue = cleanText(form.get('status'), 20);
  const status: CmsArticleInput['status'] =
    statusValue === 'published' || statusValue === 'archived' ? statusValue : 'draft';

  if (!title) throw new Error('عنوان مقاله لازم است.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error('Slug باید فقط شامل حروف انگلیسی کوچک، عدد و خط تیره باشد.');
  }

  const rawContent = cleanText(form.get('content_json'), 100000) || '{"sections":[]}';
  const rawCta = cleanText(form.get('cta_json'), 20000) || '{}';

  try {
    const parsed = JSON.parse(rawContent);
    if (!parsed || !Array.isArray(parsed.sections)) throw new Error('invalid');
  } catch {
    throw new Error('ساختار محتوای مقاله معتبر نیست.');
  }

  try {
    JSON.parse(rawCta);
  } catch {
    throw new Error('ساختار CTA معتبر نیست.');
  }

  return {
    slug,
    title,
    eyebrow: cleanText(form.get('eyebrow'), 100),
    category: cleanText(form.get('category'), 100),
    excerpt: cleanText(form.get('excerpt'), 1000),
    readingTime: cleanText(form.get('reading_time'), 60),
    coverImage: cleanText(form.get('cover_image'), 1000),
    coverAlt: cleanText(form.get('cover_alt'), 500),
    contentJson: rawContent,
    takeaway: cleanText(form.get('takeaway'), 2000),
    ctaJson: rawCta,
    status,
    featured: form.get('featured') === 'on',
    metaTitle: cleanText(form.get('meta_title'), 240),
    metaDescription: cleanText(form.get('meta_description'), 500),
    canonicalUrl: cleanText(form.get('canonical_url'), 1000),
    robots: cleanText(form.get('robots'), 100) || 'index,follow'
  };
}

export async function createAdminArticle(db: ElseedD1Database, input: CmsArticleInput) {
  const id = crypto.randomUUID();
  const publishedAt = input.status === 'published' ? new Date().toISOString() : null;

  const result = await db
    .prepare(
      `INSERT INTO cms_articles
      (id, slug, title, eyebrow, category, excerpt, reading_time, cover_image, cover_alt,
       content_json, takeaway, cta_json, status, featured, meta_title, meta_description,
       canonical_url, robots, published_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`
    )
    .bind(
      id,
      input.slug,
      input.title,
      input.eyebrow,
      input.category,
      input.excerpt,
      input.readingTime,
      input.coverImage,
      input.coverAlt,
      input.contentJson,
      input.takeaway,
      input.ctaJson,
      input.status,
      input.featured ? 1 : 0,
      input.metaTitle,
      input.metaDescription,
      input.canonicalUrl || '/magazine/' + input.slug,
      input.robots,
      publishedAt
    )
    .run();

  if (result.success === false) throw new Error(result.error || 'ساخت مقاله انجام نشد.');

  await db
    .prepare(
      `INSERT INTO cms_audit_log (action, entity_type, entity_id, payload_json)
       VALUES ('create', 'article', ?, ?)`
    )
    .bind(id, JSON.stringify({ slug: input.slug, status: input.status }))
    .run();

  return id;
}

export async function updateAdminArticle(
  db: ElseedD1Database,
  id: string,
  input: CmsArticleInput
) {
  const current = await getAdminArticle(db, id);
  if (!current) throw new Error('مقاله پیدا نشد.');

  try {
    await db
      .prepare(
        `INSERT INTO cms_article_revisions (article_id, snapshot_json)
         VALUES (?, ?)`
      )
      .bind(id, JSON.stringify(current))
      .run();
  } catch {
    // Revisions are useful, but a revision write must never block saving or publishing.
  }

  const publishedAt =
    input.status === 'published'
      ? current.published_at || new Date().toISOString()
      : current.published_at;

  const result = await db
    .prepare(
      `UPDATE cms_articles SET
        slug = ?, title = ?, eyebrow = ?, category = ?, excerpt = ?, reading_time = ?,
        cover_image = ?, cover_alt = ?, content_json = ?, takeaway = ?, cta_json = ?,
        status = ?, featured = ?, meta_title = ?, meta_description = ?, canonical_url = ?,
        robots = ?, published_at = ?, updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(
      input.slug,
      input.title,
      input.eyebrow,
      input.category,
      input.excerpt,
      input.readingTime,
      input.coverImage,
      input.coverAlt,
      input.contentJson,
      input.takeaway,
      input.ctaJson,
      input.status,
      input.featured ? 1 : 0,
      input.metaTitle,
      input.metaDescription,
      input.canonicalUrl || '/magazine/' + input.slug,
      input.robots,
      publishedAt,
      id
    )
    .run();

  if (result.success === false) throw new Error(result.error || 'ویرایش مقاله انجام نشد.');

  try {
    await db
      .prepare(
        `INSERT INTO cms_audit_log (action, entity_type, entity_id, payload_json)
         VALUES ('update', 'article', ?, ?)`
      )
      .bind(id, JSON.stringify({ slug: input.slug, status: input.status }))
      .run();
  } catch {
    // Audit logging is best-effort and must not block the editorial workflow.
  }
}

export async function deleteAdminArticle(db: ElseedD1Database, id: string) {
  const current = await getAdminArticle(db, id);
  if (!current) return;

  await db
    .prepare(
      `INSERT INTO cms_audit_log (action, entity_type, entity_id, payload_json)
       VALUES ('delete', 'article', ?, ?)`
    )
    .bind(id, JSON.stringify({ slug: current.slug, title: current.title }))
    .run();

  await db.prepare('DELETE FROM cms_articles WHERE id = ?').bind(id).run();
}


export async function setAdminArticleStatus(
  db: ElseedD1Database,
  id: string,
  status: 'draft' | 'published' | 'archived'
) {
  const publishedAtSql =
    status === 'published'
      ? "COALESCE(published_at, datetime('now'))"
      : 'published_at';

  const result = await db
    .prepare(
      `UPDATE cms_articles
       SET status = ?, published_at = ${publishedAtSql}, updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(status, id)
    .run();

  if (result.success === false) {
    throw new Error(result.error || 'تغییر وضعیت مقاله انجام نشد.');
  }

  const verified = await db
    .prepare('SELECT id, status, published_at FROM cms_articles WHERE id = ? LIMIT 1')
    .bind(id)
    .first<{ id: string; status: string; published_at: string | null }>();

  if (!verified || verified.status !== status) {
    throw new Error('وضعیت مقاله بعد از ذخیره تأیید نشد.');
  }

  try {
    await db
      .prepare(
        `INSERT INTO cms_audit_log (action, entity_type, entity_id, payload_json)
         VALUES ('status_change', 'article', ?, ?)`
      )
      .bind(id, JSON.stringify({ status }))
      .run();
  } catch {
    // Audit logging must not block publishing.
  }

  return verified;
}
