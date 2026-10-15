import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const chromiumPath =
  process.env.CHROMIUM_PATH ||
  (existsSync("/usr/bin/chromium") ? "/usr/bin/chromium" : undefined);

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  timeout: 60_000,
  expect: { timeout: 6_000 },
  reporter: "list",
  outputDir: "./test-results",
  use: {
    baseURL: "http://127.0.0.1:5173",
    browserName: "chromium",
    launchOptions: { executablePath: chromiumPath },
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "375x812",
      testIgnore: ["**/*.desktop.spec.ts", "**/*.touch.spec.ts"],
      use: { viewport: { width: 375, height: 812 } },
    },
    {
      name: "390x844",
      testIgnore: "**/*.desktop.spec.ts",
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: "430x932",
      testIgnore: ["**/*.desktop.spec.ts", "**/*.touch.spec.ts"],
      use: { viewport: { width: 430, height: 932 } },
    },
    {
      name: "1440x900",
      testIgnore: "**/*.touch.spec.ts",
      use: { viewport: { width: 1440, height: 900 } },
    },
    {
      name: "reduced-motion",
      testIgnore: ["**/*.desktop.spec.ts", "**/*.touch.spec.ts"],
      use: { viewport: { width: 390, height: 844 }, reducedMotion: "reduce" },
    },
  ],
  webServer: {
    command: "npm run dev -- --port 5173 --strictPort",
    url: "http://127.0.0.1:5173",
    reuseExistingServer: !process.env.CI,
  },
});
