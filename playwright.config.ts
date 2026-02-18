import { defineConfig } from '@playwright/test'

export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000'
  },
  testDir: undefined,
  timeout: 15000
})
