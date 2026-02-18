Feature: E2E setup verification

  Scenario: E2E runner and Playwright work
    When a guest opens a blank page
    Then the page has loaded
