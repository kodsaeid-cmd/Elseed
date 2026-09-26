export type CoffeeProfileSignal = {
  key: string;
  value: string;
  label: string;
  source: string;
  updatedAt: string;
};

export type CoffeeProfileSnapshot = {
  anonymousId: string;
  preferences: Record<string, any>;
  signals: Record<string, CoffeeProfileSignal>;
  latestFix: {
    code: string;
    confidence: string;
    brew: string;
    problem: string;
    createdAt: string;
  } | null;
  journeyCounts: Record<string, number>;
  updatedAt: string | null;
};

function safeJson(value: unknown, fallback: any = {}) {
  try {
    const parsed = JSON.parse(typeof value === 'string' ? value : '');
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export async function readCoffeeProfile(
  db: ElseedD1Database,
  anonymousId: string
): Promise<CoffeeProfileSnapshot> {
  const [profileRow, fixRow, counts] = await Promise.all([
    db
      .prepare(
        `SELECT preferences_json, caffeine_profile_json, updated_at
         FROM coffee_profiles
         WHERE anonymous_id = ?
         LIMIT 1`
      )
      .bind(anonymousId)
      .first<Record<string, any>>(),
    db
      .prepare(
        `SELECT payload_json, created_at
         FROM interaction_events
         WHERE anonymous_id = ?
           AND journey_type = 'fix'
           AND event_name = 'diagnosis'
         ORDER BY created_at DESC
         LIMIT 1`
      )
      .bind(anonymousId)
      .first<Record<string, any>>(),
    db
      .prepare(
        `SELECT journey_type, COUNT(*) AS count
         FROM journey_sessions
         WHERE anonymous_id = ?
           AND status = 'completed'
         GROUP BY journey_type`
      )
      .bind(anonymousId)
      .all<{ journey_type: string; count: number }>()
  ]);

  const caffeine = safeJson(profileRow?.caffeine_profile_json, {});
  const rawSignals = caffeine?.signals && typeof caffeine.signals === 'object' ? caffeine.signals : {};
  const latestFixPayload = safeJson(fixRow?.payload_json, null);

  return {
    anonymousId,
    preferences: safeJson(profileRow?.preferences_json, {}),
    signals: rawSignals,
    latestFix: latestFixPayload
      ? {
          code: String(latestFixPayload.code ?? ''),
          confidence: String(latestFixPayload.confidence ?? ''),
          brew: String(latestFixPayload.brew ?? ''),
          problem: String(latestFixPayload.problem ?? ''),
          createdAt: String(fixRow?.created_at ?? '')
        }
      : null,
    journeyCounts: Object.fromEntries(
      (counts.results ?? []).map((item) => [String(item.journey_type), Number(item.count ?? 0)])
    ),
    updatedAt: profileRow?.updated_at ? String(profileRow.updated_at) : null
  };
}

export async function saveCoffeeProfileSignal(
  db: ElseedD1Database,
  input: {
    anonymousId: string;
    key: string;
    value: string;
    label: string;
    source: string;
  }
) {
  const row = await db
    .prepare(
      `SELECT id, preferences_json, caffeine_profile_json
       FROM coffee_profiles
       WHERE anonymous_id = ?
       LIMIT 1`
    )
    .bind(input.anonymousId)
    .first<Record<string, any>>();

  const caffeine = safeJson(row?.caffeine_profile_json, {});
  const signals =
    caffeine?.signals && typeof caffeine.signals === 'object' ? { ...caffeine.signals } : {};
  const now = new Date().toISOString();

  signals[input.key] = {
    key: input.key,
    value: input.value,
    label: input.label,
    source: input.source,
    updatedAt: now
  };

  const history = Array.isArray(caffeine?.history) ? caffeine.history.slice(-39) : [];
  history.push({
    key: input.key,
    value: input.value,
    label: input.label,
    source: input.source,
    updatedAt: now
  });

  const nextCaffeine = JSON.stringify({
    ...caffeine,
    signals,
    history
  });

  if (row?.id) {
    await db
      .prepare(
        `UPDATE coffee_profiles
         SET caffeine_profile_json = ?, updated_at = datetime('now')
         WHERE id = ?`
      )
      .bind(nextCaffeine, row.id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO coffee_profiles
          (id, anonymous_id, preferences_json, caffeine_profile_json, created_at, updated_at)
         VALUES (?, ?, '{}', ?, datetime('now'), datetime('now'))`
      )
      .bind(crypto.randomUUID(), input.anonymousId, nextCaffeine)
      .run();
  }

  await db
    .prepare(
      `INSERT INTO interaction_events
        (anonymous_id, journey_type, event_name, payload_json, created_at)
       VALUES (?, 'me', 'profile_signal', ?, datetime('now'))`
    )
    .bind(
      input.anonymousId,
      JSON.stringify({
        key: input.key,
        value: input.value,
        label: input.label,
        source: input.source
      })
    )
    .run();
}
