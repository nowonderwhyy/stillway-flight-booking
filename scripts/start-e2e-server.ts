import { spawn } from "node:child_process";
import { copyFileSync, existsSync } from "node:fs";
import path from "node:path";

const dataDirectory = path.resolve("data");
const sourceDatabase = path.resolve(dataDirectory, "stillway.db");
const databasePath = path.resolve(dataDirectory, "stillway.e2e.db");
const nextCli = path.resolve("node_modules/next/dist/bin/next");

if (path.dirname(databasePath) !== dataDirectory) {
  throw new Error("Refusing to prepare an E2E database outside the project data directory.");
}
if (!existsSync(sourceDatabase)) {
  throw new Error("Run npm run db:setup before E2E tests so the seeded database can be isolated.");
}
copyFileSync(sourceDatabase, databasePath);

const env = { ...process.env, DATABASE_URL: "file:./data/stillway.e2e.db" };

const server = spawn(process.execPath, [nextCli, "start", "--hostname", "127.0.0.1", "--port", "3100"], {
  env,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 0));
