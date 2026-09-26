export type CoffeeStoryRow = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  story_text: string;
  lesson: string;
  story_type: string;
  era: string;
  place: string;
  image_url: string;
  source_label: string;
  source_url: string;
  is_factual: number;
  status: string;
  featured: number;
  created_at: string;
  updated_at: string;
};

export type CoffeeStory = {
  id: string;
  slug: string;
  title: string;
  kicker: string;
  excerpt: string;
  story: string;
  lesson: string;
  type: string;
  era: string;
  place: string;
  image: string;
  sourceLabel: string;
  sourceUrl: string;
  factual: boolean;
  featured: boolean;
};

function toStory(row: CoffeeStoryRow): CoffeeStory {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    kicker: row.kicker,
    excerpt: row.excerpt,
    story: row.story_text,
    lesson: row.lesson,
    type: row.story_type,
    era: row.era,
    place: row.place,
    image: row.image_url,
    sourceLabel: row.source_label,
    sourceUrl: row.source_url,
    factual: Boolean(row.is_factual),
    featured: Boolean(row.featured)
  };
}

export async function getDailyCoffeeStory(
  db: ElseedD1Database,
  anonymousId: string,
  localDate: string
) {
  const existing = await db
    .prepare(
      `SELECT s.*
       FROM coffee_story_assignments a
       JOIN coffee_stories s ON s.id = a.story_id
       WHERE a.anonymous_id = ? AND a.local_date = ?
       LIMIT 1`
    )
    .bind(anonymousId, localDate)
    .first<CoffeeStoryRow>();

  if (existing) return toStory(existing);

  let candidate = await db
    .prepare(
      `SELECT s.*
       FROM coffee_stories s
       WHERE s.status = 'published'
         AND NOT EXISTS (
           SELECT 1
           FROM coffee_story_assignments a
           WHERE a.anonymous_id = ?
             AND a.story_id = s.id
             AND a.assigned_at >= datetime('now', '-180 days')
         )
       ORDER BY s.featured DESC, RANDOM()
       LIMIT 1`
    )
    .bind(anonymousId)
    .first<CoffeeStoryRow>();

  if (!candidate) {
    candidate = await db
      .prepare(
        `SELECT *
         FROM coffee_stories
         WHERE status = 'published'
         ORDER BY featured DESC, RANDOM()
         LIMIT 1`
      )
      .first<CoffeeStoryRow>();
  }

  if (!candidate) return null;

  await db
    .prepare(
      `INSERT OR IGNORE INTO coffee_story_assignments
        (anonymous_id, local_date, story_id, assigned_at)
       VALUES (?, ?, ?, datetime('now'))`
    )
    .bind(anonymousId, localDate, candidate.id)
    .run();

  const assigned = await db
    .prepare(
      `SELECT s.*
       FROM coffee_story_assignments a
       JOIN coffee_stories s ON s.id = a.story_id
       WHERE a.anonymous_id = ? AND a.local_date = ?
       LIMIT 1`
    )
    .bind(anonymousId, localDate)
    .first<CoffeeStoryRow>();

  return assigned ? toStory(assigned) : toStory(candidate);
}

export async function getCoffeeStoryHistory(
  db: ElseedD1Database,
  anonymousId: string,
  limit = 8
) {
  const result = await db
    .prepare(
      `SELECT s.*, a.local_date
       FROM coffee_story_assignments a
       JOIN coffee_stories s ON s.id = a.story_id
       WHERE a.anonymous_id = ?
       ORDER BY a.local_date DESC, a.assigned_at DESC
       LIMIT ?`
    )
    .bind(anonymousId, Math.max(1, Math.min(30, limit)))
    .all<CoffeeStoryRow & { local_date: string }>();

  return (result.results ?? []).map((row) => ({
    ...toStory(row),
    localDate: row.local_date
  }));
}

export async function getAdminStories(db?: ElseedD1Database) {
  if (!db) return [] as CoffeeStoryRow[];

  const result = await db
    .prepare(
      `SELECT *
       FROM coffee_stories
       ORDER BY CASE status WHEN 'draft' THEN 0 WHEN 'published' THEN 1 ELSE 2 END,
                featured DESC,
                updated_at DESC`
    )
    .all<CoffeeStoryRow>();

  return result.results ?? [];
}

export async function getPublishedStoryCount(db?: ElseedD1Database) {
  if (!db) return 0;
  const row = await db
    .prepare("SELECT COUNT(*) AS count FROM coffee_stories WHERE status = 'published'")
    .first<{ count: number }>();
  return Number(row?.count ?? 0);
}
