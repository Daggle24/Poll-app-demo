Feature: Public voting
  As an anonymous guest I can view and vote on polls.
  Scenarios mirror openspec/changes/poll-app/specs/public-voting/spec.md

  Scenario: Guest visits valid poll link
    When an anonymous guest navigates to the poll page for poll "VALID_POLL_ID"
    Then the system displays the poll question and vote form with options

  Scenario: Guest visits invalid poll link
    When a guest navigates to the poll page for poll "nonexistent-id-12345"
    Then the system displays "Poll not found"

  Scenario: Successful vote
    Given an active poll exists with id "VOTE_POLL_ID"
    When a guest navigates to the poll page for poll "VOTE_POLL_ID"
    And the guest selects the first option
    And the guest clicks the "Vote" button
    Then the system displays the results view
    And the cookie "voted_POLL" is set

  Scenario: Vote without selecting an option
    Given an active poll exists with id "NO_SELECT_POLL_ID"
    When a guest navigates to the poll page for poll "NO_SELECT_POLL_ID"
    And the guest clicks the "Vote" button without selecting an option
    Then the system displays the validation message "Please select an option"

  Scenario: Vote on a closed poll
    Given a closed poll exists with id "CLOSED_POLL_ID"
    When a guest navigates to the poll page for poll "CLOSED_POLL_ID"
    Then the system displays "This poll is closed"
    And the system displays the results view

  Scenario: Return visit after voting
    Given an active poll exists with id "RETURN_POLL_ID"
    And the guest has already voted on poll "RETURN_POLL_ID"
    When a guest navigates to the poll page for poll "RETURN_POLL_ID"
    Then the system displays the results view instead of the vote form

  Scenario: First visit to a new poll
    Given an active poll exists with id "FIRST_VISIT_POLL_ID"
    And the guest has not voted on poll "FIRST_VISIT_POLL_ID"
    When a guest navigates to the poll page for poll "FIRST_VISIT_POLL_ID"
    Then the system displays the vote form

  Scenario: Option selection visual feedback
    Given an active poll exists with id "VISUAL_POLL_ID"
    When a guest navigates to the poll page for poll "VISUAL_POLL_ID"
    And the guest clicks on an option row
    Then the selected option displays a highlight or checkmark

  @mobile
  Scenario: Mobile layout
    Given an active poll exists with id "MOBILE_POLL_ID"
    When a guest views the poll page for poll "MOBILE_POLL_ID" on a viewport narrower than 640px
    Then the layout is stacked vertically and the vote form is usable
