import "dotenv/config";
import { closeSync, mkdirSync, openSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const databaseUrl = process.env.DATABASE_URL ?? "file:./data/stillway.db";

if (databaseUrl.startsWith("file:")) {
  const databasePath = databaseUrl.startsWith("file://")
    ? fileURLToPath(databaseUrl)
    : path.resolve(databaseUrl.slice(5));

  mkdirSync(path.dirname(databasePath), { recursive: true });
  closeSync(openSync(databasePath, "a"));
  console.log(`Prepared SQLite database at ${databasePath}`);
}
