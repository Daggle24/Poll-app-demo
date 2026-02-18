import type { IConfiguration } from '@cucumber/cucumber'

export default {
  paths: ['e2e/features/**/*.feature'],
  import: ['e2e/support/**/*.ts', 'e2e/steps/**/*.ts'],
  format: ['progress'],
  forceExit: true
} satisfies Partial<IConfiguration>
