import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    fileParallelism: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/generated/**", "src/app/**"],
    },
  },
});
