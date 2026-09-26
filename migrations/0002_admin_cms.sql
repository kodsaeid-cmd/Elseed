-- EL.SEED admin/CMS foundation.
-- D1 remains the application/content database; commerce can stay behind a Medusa adapter.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cms_articles (
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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0,1)),
  meta_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  canonical_url TEXT NOT NULL DEFAULT '',
  robots TEXT NOT NULL DEFAULT 'index,follow',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cms_articles_status_date
  ON cms_articles (status, published_at DESC);

CREATE INDEX IF NOT EXISTS idx_cms_articles_category
  ON cms_articles (category, status);

CREATE TABLE IF NOT EXISTS cms_article_revisions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  article_id TEXT NOT NULL,
  snapshot_json TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (article_id) REFERENCES cms_articles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cms_article_revisions_article
  ON cms_article_revisions (article_id, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_media_assets (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL DEFAULT '',
  width INTEGER,
  height INTEGER,
  source TEXT NOT NULL DEFAULT 'external',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cms_site_settings (
  key TEXT PRIMARY KEY,
  value_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS cms_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_cms_audit_log_created
  ON cms_audit_log (created_at DESC);
