Feature: Poll management
  As an authenticated admin I can create and manage polls.
  Scenarios mirror openspec/changes/poll-app/specs/poll-management/spec.md

  Scenario: Successful poll creation
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin submits a valid question with 3 options
    Then the system creates the poll and redirects to the poll detail page

  Scenario: Too few options
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin fills the question but only one option
    Then the admin sees the validation error "Poll must have at least 2 options"

  Scenario: Max options enforced
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin adds options until the maximum is reached
    Then the add option button is disabled

  Scenario: Empty question
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin fills options but leaves the question blank
    Then the admin sees the validation error "Question is required"

  Scenario: Add option
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin clicks the add option button
    Then a new option input field appears

  Scenario: Remove option
    Given the admin is logged in
    When the admin goes to the create poll page
    And the admin clicks the add option button
    And the admin clicks the remove button on one option
    Then that option field is removed

  Scenario: Dashboard with polls
    Given the admin is logged in
    When the admin visits the dashboard
    Then the system displays the poll list with questions and vote counts

  Scenario: Copy shareable link
    Given the admin is logged in
    When the admin visits the dashboard
    And the admin clicks the copy share link button on the first poll
    Then a copied confirmation appears

  Scenario: Close an active poll
    Given the admin is logged in
    When the admin navigates to the poll detail for the first poll
    And the admin clicks close poll and confirms
    Then the poll is closed and the UI reflects the closed state

  Scenario: View poll detail
    Given the admin is logged in
    When the admin navigates to the poll detail for the first poll
    Then the system displays full poll details with vote counts and percentages
