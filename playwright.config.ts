import { defineConfig, devices } from "@playwright/test";

declare const process: {
  env: Record<string, string | undefined>;
  loadEnvFile(): void;
};

try {
  process.loadEnvFile();
} catch {
  // The .env file is optional.
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // headed + trace + many workers = out of memory on local
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "reports" }],
  ],
  use: {
    // "on" = passed + failed (open from HTML report)
    // keep workers: 1 locally so headed + trace does not OOM
    trace: "on",
    screenshot: "on",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
