declare global {
  namespace NodeJS {
    interface Env {
      DB: D1Database;
      // Add other environment variables here
    }
  }
}

export type {};
