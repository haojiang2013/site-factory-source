import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  use: { baseURL: 'http://localhost:3475', headless: true },
  webServer: {
    command: 'npx next dev -p 3475',
    port: 3475,
    reuseExistingServer: true,
  },
});
