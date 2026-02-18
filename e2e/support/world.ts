import { setWorldConstructor } from '@cucumber/cucumber'
import type { Page } from '@playwright/test'

export interface E2EWorld {
  page: Page
  baseURL: string
  pollId?: string
}

function World (this: E2EWorld) {
  this.baseURL = process.env.BASE_URL ?? 'http://localhost:3000'
  this.page = null as unknown as Page
}

setWorldConstructor(World)
