import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

const configuredUrl = process.env.DATABASE_URL ?? "file:./data/stillway.db";
const migrationUrl = configuredUrl.startsWith("file:./")
  ? `file:${path.resolve(configuredUrl.slice(5)).replaceAll("\\", "/")}`
  : configuredUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl,
  },
});
