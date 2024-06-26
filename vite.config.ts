/// <reference types="vitest" />
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'v8'
    },
    testTimeout: 3000,
  },
  base: "/Battleship/",
});
