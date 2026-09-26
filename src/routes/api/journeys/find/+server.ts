import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type FindProfile = {
  time?: string;
  effect?: string;
  sensitivity?: string;
  taste?: string;
  brew?: string;
  line?: string;
  blend?: string;
  roast?: string;
  flavor?: string;
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  if (!db) {
    return json({ ok: false }, { status: 503 });
  }

  let body: { anonymousId?: unknown; profile?: FindProfile };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const anonymousId =
    typeof body.anonymousId === 'string' && body.anonymousId.length <= 100
      ? body.anonymousId
      : '';

  const profile = body.profile ?? {};

  if (!anonymousId || typeof profile.line !== 'string') {
    return json({ ok: false }, { status: 400 });
  }

  const allowedLines = new Set(['FULL', 'HALF', 'LOW', 'DECAF']);
  if (!allowedLines.has(profile.line)) {
    return json({ ok: false }, { status: 400 });
  }

  const safeProfile = {
    journey: 'find',
    time: typeof profile.time === 'string' ? profile.time.slice(0, 32) : null,
    effect: typeof profile.effect === 'string' ? profile.effect.slice(0, 32) : null,
    sensitivity: typeof profile.sensitivity === 'string' ? profile.sensitivity.slice(0, 32) : null,
    taste: typeof profile.taste === 'string' ? profile.taste.slice(0, 32) : null,
    brew: typeof profile.brew === 'string' ? profile.brew.slice(0, 32) : null,
    line: profile.line,
    blend: typeof profile.blend === 'string' ? profile.blend.slice(0, 32) : null,
    roast: typeof profile.roast === 'string' ? profile.roast.slice(0, 64) : null,
    flavor: typeof profile.flavor === 'string' ? profile.flavor.slice(0, 160) : null
  };

  try {
    const sessionId = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO journey_sessions
          (id, journey_type, anonymous_id, status, started_at, completed_at)
         VALUES (?, 'find', ?, 'completed', datetime('now'), datetime('now'))`
      )
      .bind(sessionId, anonymousId)
      .run();

    await db
      .prepare(
        `INSERT INTO coffee_profiles
          (id, anonymous_id, preferences_json, caffeine_profile_json, created_at, updated_at)
         VALUES (?, ?, ?, '{}', datetime('now'), datetime('now'))
         ON CONFLICT(anonymous_id) DO UPDATE SET
           preferences_json = excluded.preferences_json,
           updated_at = datetime('now')`
      )
      .bind(crypto.randomUUID(), anonymousId, JSON.stringify(safeProfile))
      .run();

    await db
      .prepare(
        `INSERT INTO interaction_events
          (anonymous_id, session_id, journey_type, event_name, payload_json, created_at)
         VALUES (?, ?, 'find', 'diagnosis', ?, datetime('now'))`
      )
      .bind(
        anonymousId,
        sessionId,
        JSON.stringify({
          line: safeProfile.line,
          blend: safeProfile.blend,
          taste: safeProfile.taste,
          brew: safeProfile.brew
        })
      )
      .run();

    return json({ ok: true });
  } catch (error) {
    console.error('find journey persistence failed', error);
    return json({ ok: false }, { status: 500 });
  }
};
