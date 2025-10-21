import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

const {
  APP_DEBUG = "true",
  APP_PORT = "3000",
  APP_URL = "http://localhost",
  DB_CONNECTION = "pgsql",
  DATABASE_URL,
  DB_HOST = "127.0.0.1",
  DB_PORT = "5432",
  DB_NAME = "db-financiera",
  DB_USER,
  DB_PASSWORD = "",
  CLIENT_API_KEY = "API_KEY",
} = process.env;

console.log(
  "CONFIG ->",
  "APP_DEBUG:",
  APP_DEBUG,
  "DB_CONNECTION:",
  DB_CONNECTION,
  "DB_HOST:",
  DB_HOST,
  "DB_PORT:",
  DB_PORT,
  "DB_NAME:",
  DB_NAME,
  "DB_USER:",
  DB_USER ? "<set>" : "<not-set>"
);

export const Config: IConfig = {
  app: {
    debug: APP_DEBUG ?? "true",
    port: isNaN(Number(APP_PORT)) ? APP_PORT : Number(APP_PORT),
    url: APP_URL || "http://localhost",
  },
  database: {
    connection: (DB_CONNECTION as Driver) ?? "pgsql",
    connections: {
      driver: "postgres",
      url: DATABASE_URL,
      host: DB_HOST,
      port: DB_PORT ?? 5432,
      database: DB_NAME,
      username: DB_USER ?? "postgres",
      password: DB_PASSWORD ?? "",
    },
  },
  api: {
    key: CLIENT_API_KEY,
  },
};

type Driver = "pgsql" | "mysql" | "sqlite";
interface IConfig {
  app: {
    debug: string;
    port: number | string;
    url: string;
  };
  database: {
    connection: Driver;
    connections: {
      driver: string;
      url?: string | undefined;
      host: string;
      port: string | number;
      database: string;
      username: string;
      password: string;
    };
  };
  api: {
    key: string;
  };
}
