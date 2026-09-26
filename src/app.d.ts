declare global {
  interface ElseedD1PreparedStatement {
    bind(...values: unknown[]): ElseedD1PreparedStatement;
    run(): Promise<{ success?: boolean; error?: string; meta?: unknown }>;
    first<T = Record<string, unknown>>(): Promise<T | null>;
    all<T = Record<string, unknown>>(): Promise<{ results?: T[]; success?: boolean; error?: string }>;
  }

  interface ElseedD1Database {
    prepare(query: string): ElseedD1PreparedStatement;
  }

  namespace App {
    interface Platform {
      env: {
        DB: ElseedD1Database;
        [key: string]: unknown;
      };
    }
  }
}

export {};
