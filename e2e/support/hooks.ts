import 'dotenv/config'
import { Before, After, setDefaultTimeout } from '@cucumber/cucumber'
import { chromium } from '@playwright/test'
import type { E2EWorld } from './world'

setDefaultTimeout(30_000)

Before(async function (this: E2EWorld) {
  const headless = process.env.E2E_HEADED !== '1' && process.env.E2E_HEADED !== 'true'
  const browser = await chromium.launch({ headless })
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
  this.page = await context.newPage()
  ;(this as unknown as { _browser: Awaited<ReturnType<typeof chromium.launch>> })._browser = browser
})

After(async function (this: E2EWorld & { _browser?: Awaited<ReturnType<typeof chromium.launch>> }) {
  if (this.page) await this.page.close()
  if (this._browser) await this._browser.close()
})
