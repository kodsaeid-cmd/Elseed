-- EL.SEED D1 initial application schema.
-- Commerce/order data intentionally stays out of D1.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS journey_sessions (
  id TEXT PRIMARY KEY,
  journey_type TEXT NOT NULL CHECK (journey_type IN ('find', 'fix', 'me')),
  anonymous_id TEXT,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
  started_at TEXT NOT NULL DEFAULT (datetime('now')),
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_journey_sessions_anonymous
  ON journey_sessions (anonymous_id, started_at);

CREATE INDEX IF NOT EXISTS idx_journey_sessions_user
  ON journey_sessions (user_id, started_at);

CREATE TABLE IF NOT EXISTS journey_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  question_key TEXT NOT NULL,
  answer_value TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (session_id) REFERENCES journey_sessions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_journey_answers_session
  ON journey_answers (session_id, id);

CREATE TABLE IF NOT EXISTS coffee_profiles (
  id TEXT PRIMARY KEY,
  anonymous_id TEXT,
  user_id TEXT,
  preferences_json TEXT NOT NULL DEFAULT '{}',
  caffeine_profile_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_coffee_profiles_anonymous
  ON coffee_profiles (anonymous_id)
  WHERE anonymous_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_coffee_profiles_user
  ON coffee_profiles (user_id)
  WHERE user_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email TEXT PRIMARY KEY COLLATE NOCASE,
  status TEXT NOT NULL DEFAULT 'subscribed' CHECK (status IN ('subscribed', 'unsubscribed')),
  source TEXT NOT NULL DEFAULT 'homepage',
  consented_at TEXT NOT NULL DEFAULT (datetime('now')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS interaction_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  anonymous_id TEXT,
  user_id TEXT,
  session_id TEXT,
  journey_type TEXT,
  event_name TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_interaction_events_session
  ON interaction_events (session_id, created_at);

CREATE INDEX IF NOT EXISTS idx_interaction_events_name
  ON interaction_events (event_name, created_at);
