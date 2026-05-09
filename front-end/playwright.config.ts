import { defineConfig, devices } from "@playwright/test";

/** Frontend E2Eの接続先URL。 */
const baseURL = process.env["E2E_BASE_URL"] ?? "http://localhost:3000";

/** API E2Eの接続先URL。 */
const apiBaseURL = process.env["E2E_API_BASE_URL"] ?? "http://localhost:8080";

export default defineConfig({
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  outputDir: "test-results",
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
      },
    },
  ],
  reporter: [["list"]],
  retries: 0,
  testDir: "./e2e",
  timeout: 60_000,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  workers: 1,
  metadata: {
    apiBaseURL,
  },
});
