declare global {
  namespace NodeJS {
    interface Env {
      DB: D1Database;
    }
  }
}

export type {};
