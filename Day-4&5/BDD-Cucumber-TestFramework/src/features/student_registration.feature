Feature: Student registration

  As a user
  I want to enter different student details
  So that I can verify the registration form for multiple users

  Background:
    Given the user opens the student registration page

  Scenario Outline: Verify the registration form for multiple users
    When the user fills the student registration form with "<name>", "<email>", "<gender>", "<mobile>", "<subject>", "<hobby>", "<address>", "<state>" and "<city>"
    Then the login button should be enabled

    Examples:
      | name         | email                    | gender | mobile     | subject          | hobby   | address                      | state         | city    |
      | John Doe     | john.doe@example.com     | Male   | 9876543210 | Maths            | Sports  | 123 Main Street, Agra        | Uttar Pradesh | Agra    |
      | Priya Sharma | priya.sharma@example.com | Female | 9876543211 | Computer Science | Reading | 45 Park Road, Lucknow        | Uttar Pradesh | Lucknow |
      | Alex Morgan  | alex.morgan@example.com  | Other  | 9876543212 | English          | Music   | 78 Lake View Road, Ahmedabad | Rajasthan     | Agra    |