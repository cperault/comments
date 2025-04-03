import { Pool, QueryArrayConfig } from "pg";
import { config } from "./config";

export class Database {
  private pool: Pool;

  constructor() {
    console.log("Initializing database connection...");
    this.pool = new Pool({
      connectionString: config.databaseUrl,
    });

    this.pool.on("error", (err) => {
      console.error("Unexpected error on idle client", err);
    });
  }

  async query(text: string | QueryArrayConfig<any>, params: (string | number)[]) {
    try {
      const result = await this.pool.query(text, params);
      return result;
    } catch (error) {
      console.error("Database query error:", error);
      throw error;
    }
  }

  async checkConnection() {
    try {
      const client = await this.pool.connect();
      console.log("Successfully connected to database");
      client.release();
      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database connection error:", {
          message: error.message,
          code: (error as any).code,
          stack: error.stack,
          config: this.pool.options,
        });
      } else {
        console.error("Database connection error: Unknown error type", {
          error,
          config: this.pool.options,
        });
      }
      return false;
    }
  }
}
