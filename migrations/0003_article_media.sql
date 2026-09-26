-- Article media workspace: multiple images/videos with per-paragraph placement.

ALTER TABLE cms_media_assets ADD COLUMN object_key TEXT NOT NULL DEFAULT '';
ALTER TABLE cms_media_assets ADD COLUMN media_type TEXT NOT NULL DEFAULT 'image';
ALTER TABLE cms_media_assets ADD COLUMN size_bytes INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_cms_media_assets_type_created
  ON cms_media_assets (media_type, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_article_media (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  media_id TEXT NOT NULL,
  after_paragraph INTEGER NOT NULL DEFAULT 1,
  caption TEXT NOT NULL DEFAULT '',
  alt_text TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (article_id) REFERENCES cms_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES cms_media_assets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_cms_article_media_article
  ON cms_article_media (article_id, after_paragraph, sort_order);
