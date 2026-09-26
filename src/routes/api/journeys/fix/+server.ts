import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const answerKeys = ['brew', 'problem', 'flow', 'grind', 'water', 'ratio', 'roast', 'technique'] as const;

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ ok: false }, { status: 503 });

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false }, { status: 400 });
  }

  const anonymousId =
    typeof body.anonymousId === 'string' && body.anonymousId.length <= 100
      ? body.anonymousId
      : '';

  if (!anonymousId) return json({ ok: false }, { status: 400 });

  const mode = body.mode === 'feedback' ? 'feedback' : 'diagnosis';

  try {
    if (mode === 'feedback') {
      const sessionId =
        typeof body.sessionId === 'string' && body.sessionId.length <= 100 ? body.sessionId : '';
      const feedback =
        body.feedback === 'fixed' || body.feedback === 'not_fixed' ? body.feedback : '';

      if (!sessionId || !feedback) return json({ ok: false }, { status: 400 });

      await db
        .prepare(
          `INSERT INTO interaction_events
            (anonymous_id, session_id, journey_type, event_name, payload_json, created_at)
           VALUES (?, ?, 'fix', 'diagnosis_feedback', ?, datetime('now'))`
        )
        .bind(anonymousId, sessionId, JSON.stringify({ feedback }))
        .run();

      return json({ ok: true });
    }

    const answers = body.answers && typeof body.answers === 'object' ? body.answers : {};
    const diagnosis = body.diagnosis && typeof body.diagnosis === 'object' ? body.diagnosis : {};

    if (typeof answers.brew !== 'string' || typeof answers.problem !== 'string') {
      return json({ ok: false }, { status: 400 });
    }

    const sessionId = crypto.randomUUID();

    await db
      .prepare(
        `INSERT INTO journey_sessions
          (id, journey_type, anonymous_id, status, started_at, completed_at)
         VALUES (?, 'fix', ?, 'completed', datetime('now'), datetime('now'))`
      )
      .bind(sessionId, anonymousId)
      .run();

    for (const key of answerKeys) {
      const value = typeof answers[key] === 'string' ? answers[key].slice(0, 80) : '';
      if (!value) continue;

      await db
        .prepare(
          `INSERT INTO journey_answers
            (session_id, question_key, answer_value, created_at)
           VALUES (?, ?, ?, datetime('now'))`
        )
        .bind(sessionId, key, value)
        .run();
    }

    const safeDiagnosis = {
      code: typeof diagnosis.code === 'string' ? diagnosis.code.slice(0, 80) : null,
      confidence:
        typeof diagnosis.confidence === 'string' ? diagnosis.confidence.slice(0, 40) : null,
      brew: answers.brew.slice(0, 80),
      problem: answers.problem.slice(0, 80)
    };

    await db
      .prepare(
        `INSERT INTO interaction_events
          (anonymous_id, session_id, journey_type, event_name, payload_json, created_at)
         VALUES (?, ?, 'fix', 'diagnosis', ?, datetime('now'))`
      )
      .bind(anonymousId, sessionId, JSON.stringify(safeDiagnosis))
      .run();

    return json({ ok: true, sessionId });
  } catch (error) {
    console.error('fix journey persistence failed', error);
    return json({ ok: false }, { status: 500 });
  }
};
