import "@testing-library/jest-dom/vitest";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";

const dataDirectory = path.resolve("data");
const sourceDatabase = path.join(dataDirectory, "stillway.db");
const testDatabase = path.join(dataDirectory, "stillway.test.db");

mkdirSync(dataDirectory, { recursive: true });
if (!existsSync(sourceDatabase)) {
  throw new Error("Run npm run db:setup before the test suite so seeded inventory is available.");
}
rmSync(testDatabase, { force: true });
copyFileSync(sourceDatabase, testDatabase);
process.env.DATABASE_URL = "file:./data/stillway.test.db";
