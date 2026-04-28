import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5171,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
  },
  coverage: {
      provider: "v8",

      reporter: ["text", "html"],

      include: [
        "src/**/*.tsx",
      ],

      exclude: [
        "src/**/*.test.tsx",
        "src/main.tsx",
        "src/app/providers/**",
        "src/shared/config/**",
      ],
    },
});
