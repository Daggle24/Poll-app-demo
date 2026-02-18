import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'
import type { E2EWorld } from '../support/world'

const E2E_ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? 'e2e@example.com'
const E2E_TEST_OTP = process.env.E2E_TEST_OTP ?? '000000'

async function doLogin (this: E2EWorld) {
  if (E2E_TEST_OTP.length !== 6) {
    throw new Error('E2E_TEST_OTP must be a 6-digit string.')
  }
  await this.page.goto(`${this.baseURL}/admin/login`)
  await this.page.getByLabel(/email/i).fill(E2E_ADMIN_EMAIL)
  await this.page.getByRole('button', { name: /send code/i }).click()
  await this.page.waitForURL(/\/admin\/verify/, { timeout: 15000 })

  const otpContainer = this.page.locator('[data-input-otp]')
  await otpContainer.waitFor({ state: 'visible', timeout: 10000 })
  await otpContainer.click()
  await this.page.keyboard.type(E2E_TEST_OTP, { delay: 80 })

  await this.page.waitForURL(/\/admin\/dashboard/, { timeout: 15000 })
}

Given('the admin is logged in', async function (this: E2EWorld) {
  await this.page.goto(`${this.baseURL}/admin/dashboard`)
  const url = this.page.url()
  if (url.includes('/admin/login') || url.includes('/admin/register')) {
    await doLogin.call(this)
  } else {
    const loginHeading = this.page.getByRole('heading', { name: /admin login|sign in/i })
    const isLogin = await loginHeading.isVisible().catch(() => false)
    if (isLogin) await doLogin.call(this)
  }
})

When('the admin goes to the create poll page', async function (this: E2EWorld) {
  await this.page.goto(`${this.baseURL}/admin/dashboard/new`)
  await this.page.getByLabel(/question/i).waitFor({ state: 'visible', timeout: 10000 })
})

When('the admin submits a valid question with 3 options', async function (this: E2EWorld) {
  await this.page.getByLabel(/question/i).fill('What is your favourite colour?')

  const placeholders = this.page.getByPlaceholder(/^Option \d+$/)
  const count = await placeholders.count()
  await placeholders.nth(0).fill('Red')
  await placeholders.nth(1).fill('Blue')

  if (count < 3) {
    await this.page.getByRole('button', { name: /add option/i }).click()
  }
  await this.page.getByPlaceholder(/^Option \d+$/).nth(2).fill('Green')
  await this.page.getByRole('button', { name: /create poll/i }).click()
})

When('the admin fills the question but only one option', async function (this: E2EWorld) {
  await this.page.getByLabel(/question/i).fill('Test question?')
  const options = this.page.getByPlaceholder(/^Option \d+$/)
  await options.nth(0).fill('Only one option')
  await this.page.getByRole('button', { name: /create poll/i }).click()
})

When('the admin adds options until the maximum is reached', async function (this: E2EWorld) {
  const addBtn = this.page.getByRole('button', { name: /add option/i })
  while (await addBtn.isEnabled()) {
    await addBtn.click()
  }
})

When('the admin fills options but leaves the question blank', async function (this: E2EWorld) {
  await this.page.getByLabel(/question/i).fill(' ')
  const options = this.page.getByPlaceholder(/^Option \d+$/)
  await options.nth(0).fill('Option A')
  await options.nth(1).fill('Option B')
  await this.page.getByRole('button', { name: /create poll/i }).click()
})

When('the admin clicks the add option button', async function (this: E2EWorld) {
  await this.page.getByRole('button', { name: /add option/i }).click()
})

When('the admin clicks the remove button on one option', async function (this: E2EWorld) {
  await this.page.getByRole('button', { name: /remove option/i }).first().click()
})

When('the admin visits the dashboard', async function (this: E2EWorld) {
  await this.page.goto(`${this.baseURL}/admin/dashboard`)
  await this.page.waitForLoadState('networkidle')
})

When('the admin clicks the copy share link button on the first poll', async function (this: E2EWorld) {
  await this.page.getByRole('button', { name: /copy share link/i }).first().click()
})

When('the admin navigates to the poll detail for the first poll', async function (this: E2EWorld) {
  await this.page.goto(`${this.baseURL}/admin/dashboard`)
  await this.page.waitForLoadState('networkidle')
  const pollLink = this.page.locator('a[href^="/admin/dashboard/"]:not([href="/admin/dashboard/new"])')
  await pollLink.first().click()
  await this.page.waitForURL(/\/admin\/dashboard\/(?!new)[^/]+/)
})

When('the admin clicks close poll and confirms', async function (this: E2EWorld) {
  const closeBtn = this.page.getByRole('button', { name: /close poll/i })
  const isVisible = await closeBtn.isVisible().catch(() => false)
  if (!isVisible) {
    const closedBadge = this.page.getByText('Closed')
    expect(await closedBadge.isVisible().catch(() => false)).toBe(true)
    return
  }
  await closeBtn.click()

  const dialog = this.page.locator('[role="alertdialog"]')
  await dialog.waitFor({ state: 'visible', timeout: 5000 })
  await dialog.getByRole('button', { name: /close poll/i }).click()
  await this.page.waitForLoadState('networkidle')
})

Then('the system creates the poll and redirects to the poll detail page', async function (this: E2EWorld) {
  await expect(this.page).toHaveURL(/\/admin\/dashboard\/[^/]+/)
  await expect(this.page.getByText(/votes?\s+total/i)).toBeVisible()
})

Then('the admin sees the validation error {string}', async function (this: E2EWorld, text: string) {
  await expect(this.page.getByText(text)).toBeVisible()
})

Then('the add option button is disabled', async function (this: E2EWorld) {
  await expect(this.page.getByRole('button', { name: /add option/i })).toBeDisabled()
})

Then('a new option input field appears', async function (this: E2EWorld) {
  const options = this.page.getByPlaceholder(/^Option \d+$/)
  await expect(options).toHaveCount(3)
})

Then('that option field is removed', async function (this: E2EWorld) {
  const options = this.page.getByPlaceholder(/^Option \d+$/)
  await expect(options).toHaveCount(2)
})

Then('the system displays the poll list with questions and vote counts', async function (this: E2EWorld) {
  await expect(this.page.getByText('Your polls')).toBeVisible()
  await expect(this.page.locator('a[href^="/admin/dashboard/"]').first()).toBeVisible()
})

Then('a copied confirmation appears', async function (this: E2EWorld) {
  await expect(this.page.getByText('Copied!')).toBeVisible({ timeout: 5000 })
})

Then('the poll is closed and the UI reflects the closed state', async function (this: E2EWorld) {
  await expect(this.page.getByText('Closed')).toBeVisible()
})

Then('the system displays the results without a vote form', async function (this: E2EWorld) {
  await expect(this.page.getByRole('button', { name: 'Vote' })).not.toBeVisible()
  await expect(this.page.getByText(/votes?\s+total/i)).toBeVisible()
})

Then('the system displays full poll details with vote counts and percentages', async function (this: E2EWorld) {
  await expect(this.page.getByText(/votes?\s+total/i)).toBeVisible({ timeout: 10000 })
  await expect(this.page.getByText(/\d+%/).first()).toBeVisible()
})
