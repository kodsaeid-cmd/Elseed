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

  interface ElseedR2ObjectBody {
    body: ReadableStream<Uint8Array>;
    size?: number;
    httpMetadata?: {
      contentType?: string;
      cacheControl?: string;
    };
  }

  interface ElseedR2Bucket {
    put(
      key: string,
      value: ArrayBuffer | ArrayBufferView | ReadableStream,
      options?: {
        httpMetadata?: {
          contentType?: string;
          cacheControl?: string;
        };
        customMetadata?: Record<string, string>;
      }
    ): Promise<unknown>;
    get(key: string): Promise<ElseedR2ObjectBody | null>;
    delete(key: string): Promise<void>;
  }

  namespace App {
    interface Platform {
      env: {
        DB: ElseedD1Database;
        MEDIA?: ElseedR2Bucket;
        [key: string]: unknown;
      };
    }
  }
}

export {};
