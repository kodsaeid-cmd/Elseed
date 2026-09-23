interface ElseedD1PreparedStatement {
  bind(...values: unknown[]): ElseedD1PreparedStatement;
  run(): Promise<{ success?: boolean; error?: string }>;
}

interface ElseedD1Database {
  prepare(query: string): ElseedD1PreparedStatement;
}

declare global {
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
