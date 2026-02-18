import { When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { E2EWorld } from '../support/world'

When('a guest opens a blank page', async function (this: E2EWorld) {
  await this.page.goto('about:blank')
})

Then('the page has loaded', async function (this: E2EWorld) {
  await expect(this.page).toHaveURL('about:blank')
})
