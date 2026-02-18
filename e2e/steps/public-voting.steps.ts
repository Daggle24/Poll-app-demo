import { When, Then, Given } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { E2EWorld } from '../support/world'

function requirePollId (): string {
  const id = process.env.E2E_POLL_ID
  if (!id) {
    throw new Error(
      'E2E_POLL_ID env var is required. Run: pnpm prisma db seed, then set E2E_POLL_ID in .env'
    )
  }
  return id
}

function resolveId (placeholder: string): string {
  if (placeholder.startsWith('nonexistent')) return placeholder
  return requirePollId()
}

Given('an active poll exists with id {string}', async function (this: E2EWorld, id: string) {
  this.pollId = resolveId(id)
})

Given('a closed poll exists with id {string}', async function (this: E2EWorld, _id: string) {
  const id = process.env.E2E_CLOSED_POLL_ID
  if (!id) {
    throw new Error(
      'E2E_CLOSED_POLL_ID env var is required for closed-poll scenarios. Run: pnpm prisma db seed'
    )
  }
  this.pollId = id
})

Given('the guest has already voted on poll {string}', async function (this: E2EWorld, _id: string) {
  const pid = this.pollId ?? requirePollId()
  await this.page.context().addCookies([
    { name: `voted_${pid}`, value: 'true', domain: new URL(this.baseURL).hostname, path: '/' }
  ])
})

Given('the guest has not voted on poll {string}', async function (this: E2EWorld, _id: string) {
  await this.page.context().clearCookies()
})

When('an anonymous guest navigates to the poll page for poll {string}', async function (this: E2EWorld, id: string) {
  const pid = resolveId(id)
  await this.page.goto(`${this.baseURL}/poll/${pid}`)
})

When('a guest navigates to the poll page for poll {string}', async function (this: E2EWorld, id: string) {
  const pid = this.pollId ?? resolveId(id)
  await this.page.goto(`${this.baseURL}/poll/${pid}`)
})

When('the guest selects the first option', async function (this: E2EWorld) {
  await this.page.locator('form button[type="button"]').first().click()
})

When('the guest clicks the {string} button', async function (this: E2EWorld, name: string) {
  await this.page.getByRole('button', { name }).click()
})

When('the guest clicks the {string} button without selecting an option', async function (this: E2EWorld, name: string) {
  await this.page.getByRole('button', { name }).click()
})

When('the guest clicks on an option row', async function (this: E2EWorld) {
  await this.page.locator('form button[type="button"]').first().click()
})

When('a guest views the poll page for poll {string} on a viewport narrower than 640px', async function (this: E2EWorld, id: string) {
  await this.page.setViewportSize({ width: 375, height: 667 })
  const pid = this.pollId ?? resolveId(id)
  await this.page.goto(`${this.baseURL}/poll/${pid}`)
})

Then('the system displays the poll question and vote form with options', async function (this: E2EWorld) {
  await expect(this.page.getByRole('button', { name: 'Vote' })).toBeVisible()
  await expect(this.page.locator('form button[type="button"]').first()).toBeVisible()
})

Then('the system displays {string}', async function (this: E2EWorld, text: string) {
  await expect(this.page.getByText(text)).toBeVisible()
})

Then('the system displays the results view', async function (this: E2EWorld) {
  await expect(this.page.getByText(/votes?\s+total/i)).toBeVisible()
})

Then('the cookie {string} is set', async function (this: E2EWorld, _name: string) {
  const pid = this.pollId ?? requirePollId()
  const cookies = await this.page.context().cookies()
  const found = cookies.some((c) => c.name === `voted_${pid}`)
  expect(found).toBe(true)
})

Then('the system displays the validation message {string}', async function (this: E2EWorld, text: string) {
  await expect(this.page.getByText(text)).toBeVisible()
})

Then('the system displays the results view instead of the vote form', async function (this: E2EWorld) {
  await expect(this.page.getByText(/votes?\s+total/i)).toBeVisible()
  await expect(this.page.getByRole('button', { name: 'Vote' })).not.toBeVisible()
})

Then('the system displays the vote form', async function (this: E2EWorld) {
  await expect(this.page.getByRole('button', { name: 'Vote' })).toBeVisible()
})

Then('the selected option displays a highlight or checkmark', async function (this: E2EWorld) {
  await expect(this.page.locator('form button[type="button"].border-primary').first()).toBeVisible()
})

Then('the layout is stacked vertically and the vote form is usable', async function (this: E2EWorld) {
  await expect(this.page.getByRole('button', { name: 'Vote' })).toBeVisible()
  await expect(this.page.locator('form button[type="button"]').first()).toBeVisible()
})
