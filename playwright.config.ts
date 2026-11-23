import { defineConfig } from '@playwright/test'

// `E2E_EVIDENCE=1` records every test: a final PNG per test and a video at the
// project's native viewport size, for GIF extraction. Off by default.
const evidence = process.env.E2E_EVIDENCE === '1'
const recording = (width: number, height: number) =>
  evidence ? { mode: 'on' as const, size: { width, height } } : ('off' as const)

export default defineConfig({
  globalSetup: './e2e/setup.ts',
  testDir: './e2e',
  workers: 1,
  fullyParallel: false,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'state/e2e/playwright-report', open: 'never' }],
    ...(evidence
      ? ([['json', { outputFile: 'state/e2e/results.json' }]] as const)
      : [])
  ],
  outputDir: 'state/e2e/test-results',
  use: {
    baseURL: process.env.E2E_BASE_URL,
    storageState: 'state/e2e/auth.json',
    trace: 'off',
    screenshot: evidence ? 'on' : 'only-on-failure'
  },
  projects: [
    {
      name: 'desktop',
      use: {
        viewport: { width: 1280, height: 800 },
        video: recording(1280, 800)
      }
    },
    {
      name: 'mobile',
      use: { viewport: { width: 390, height: 844 }, video: recording(390, 844) }
    }
  ],
  webServer: {
    command: 'bun server/index.ts',
    url: process.env.E2E_BASE_URL!,
    reuseExistingServer: false
  }
})
