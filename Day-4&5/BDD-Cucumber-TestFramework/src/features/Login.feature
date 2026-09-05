Feature: Login Feature

  Scenario: Successful login with valid credentials
    Given the user is on the login page
    When the user enters valid credentials
    And clicks the login button
    Then the user should be redirected to the dashboard

  Scenario: Unsuccessful login with invalid credentials
    Given the user is on the login page
    When the user enters invalid credentials
    And clicks the login button
    Then an error message should be displayed

  Scenario Outline: Login with multiple sets of credentials
    Given the user is on the login page
    When the user enters "<username>" and "<password>"
    And clicks the login button
    Then the user should see "<result>"

    Examples:
      | username       | password   | result                  |
      | validUser1     | validPass1 | redirected to dashboard |
      | validUser2     | validPass2 | redirected to dashboard |
      | invalidUser    | invalidPass| error message displayed |