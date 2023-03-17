# TEST PLAN  

***Note that we are going to refine our testing plan as the project development goes. The change log is as follow:*** 

*ChangeLog* 

|**Version**  |**Change Date** |**By** |**Description** |
| - | - | - | - |
|`V1` |Feb 16, 2023 |Juan Armijos |**Reviewers:** Everyone. |
|`V2` |March 17, 2023 |Freyja Kristjanson, Jasmine Tabuzo |**Reviewers:** Everyone. |
---

## 1 Introduction

### 1.1 Scope 

This is our testing scope for Sprint 2:
1. Shared Calendar
    - View the shared calendar
        - monthly view
        - weekly view
        - daily view 
    - Navigate through the calendar
    - Create events 
    - Update events
    - Delete events 
    - View event details 
    - Filter events by family group 

2. Family Member Profiles
    - Create an account
    - Log in into an account
    - Update Profile details
    - View Profile details 
    - Delete account

3. Family Groups
    - Create family groups
    - View family groups 
    - View family group members 
    - View profiles of family group members 
    - Leave family group 
    - Delete family group 

### 1.2 Roles and Responsibilities

|**Name** |**Net ID** |**GitHub username** |**Role** |
| - | - | - | - |
|Freyja Kristjanson  |kristjaf |@FreyjaKristjanson | Backend Developer, DB Manager |
|Jasmine Tabuzo |tabuzoj |@jasmine-tabuzo  | Full-stack developer |
|Juan Armijos  |armijosj | @armijos | Configuration Manager, Installation Team, Full-stack developer |
|Tanisha Turner  |turnert1 | @TTanisha | Frontend Developer |


--- 

## 2 Test Methodology 

### 2.1 Test Levels

#### 2.1.1 Core Feature: User Profile: 

##### **Unit Tests**

- Create User
  - Given valid input data
    - Should return the user 
  - Given all fields with valid data
    - Should return the user 
  - Given input data with an existing email
    - Should throw a duplicate key error 
  - Given input data without a first name
    - Should throw a validation error 
  - Given input data without a last name
    - Should throw a validation error 
  - Given input data with an invalid password
    - Should throw a validation error 
  - Given input data with an invalid first name
    - Should throw a validation error 
- Get User
  - Given a valid email and password
    - Should return the user 
  - Given a valid email but invalid password
    - Should return null 
  - Given invalid email and password
    - Should return null 
  - Given the ID is valid and exists in the database
    - Should return the user information 
  - Given the ID is not valid
    - Should return null 
- Update User
  - Given valid input
    - Should return the updated user 
  - Given valid input of non-required fields
    - Should return updated user 
  - Given an invalid last name
    - Should cause no change 
  - Given the email already exists
    - Should throw a duplicate key error 
  - Given an invalid email
    - Should return null 
- Delete User
  - Given a valid email
    - Should remove the user from database, and return user 
  - Given an invalid email
    - Should return null 

##### **Integration Tests**

- Create User
  - Given valid input data
    - Should return the user 
  - Given all fields with valid data
    - Should return the user 
  - Given input data with an existing email
    - Should return a status 400 
  - Given input data without a first name
    - Should return a status 400 
  - Given no password
    - Should return a status 400 
  - Given input data with an invalid password
    - Should return a status 400 
  - Given input data with an invalid first name
    - Should return a status 400 
- Get User
  - Given a valid email and password
    - Should return the user 
  - Given a valid email but invalid password
    - Should return a status 400 
  - Given invalid email and password
    - Should return a status 400 
  - Given the ID is valid and exists in the database
    - Should return the user information 
  - Given the ID is not valid
    - Should return a status 400 
- Update User
  - Given valid input
    - Should return the updated user via email
    - Should return the updated user via ID
    - Should return the updated user via email and ID
  - Given valid input of non-required fields
    - Should return updated user 
  - Given an invalid last name
    - Should return a status 400 
  - Given the email already exists
    - Should return a status 400 
  - Given an invalid email
    - Should return a status 400 
  - Given no email or ID
    - Should return a status 400 
- Delete User
  - Given a valid email
    - Should remove the user from database, and return user 
  - Given an invalid email
    - Should return a status 400 

##### **Acceptance Tests**

- Create Account 
  
  - Given a user is on the **`home`** page, 
    - when the user selects `Create an account` 
    - then the user should be redirected to the sign up page 

  - Given a user is on the  **`sign up`** page 
    - when the user enters all valid information (first name, last name, email, password, birthday) 
    - when the user selects `Create account` 
    - then their account should be created with the correct information 
    - then the page should display a success message saying their account has been created  

  - Given a user is on the  **`sign up`** page 
    - when the user enters an invalid email address
    - when the user selects `Create account` 
    - then an alert should appear saying to enter a valid email address 

  - Given a user is on the  **`sign up`** page 
    - given the user has entered a valid email 
    - when the user does not enter information into all required fields 
    - when the user selects `Create account` 
    - then an alert should appear saying which fields are required 
      
  - Given a user is on the **`sign up`** page 
    - given the user has entered a valid email 
    - when the user enters a password less than 6 characters 
    - when the user selects `Create account` 
    - then an alert should appear saying the password must be at least 6 characters 

- Get Account

  - Given a user is on the **`login page`**, 
    - when a user enters a valid email and password
    - when the user selects `sign in`
    - then the user should be logged in to the app 
    - then the user should see the **`calendar`** page 

  - Given a user is on the **`login page`**, 
    - when a user enters an invalid email and password combination 
    - when the user selects `sign in`
    - then the user should see an alert saying `invalid credentials` 
    - then the user should remain on the login page 

  - Given a user is logged in, 
    - given the user belongs to a family group
    - given the family group has other members
    - when the user selects a member in that family group
    - then the member's profile page should appear 
    - then the profile page should display the email, first name, last name, birthday, nickname, pronouns, address, cell number, and phone number of that member 

- Update Account 

  - Given a user is logged in, 
    - given a user selects `My profile` in the navigation bar 
    - then the user should be redirected to their own profile page
    - then the profile page should display the email, first name, last name, birthday, nickname, pronouns, address, cell number, and phone number of the user 
    - then all fields should be *'Read-only'*
    - then an `Edit` button should be displayed 
    - then a `Delete account` button should be displayed 

  - Given a user is on the **`My profile`** page 
    - when the user selects `Edit` 
    - then all fields should be editable except email 
    - then `Discard changes` and `Update` buttons should be displayed 
   
  - Given a user is on the *`Edit mode`* of the **`My profile`** page 
    - when the user enters valid information 
    - when the user selects `update`
    - then the user's account should be updated
    - then the profile page should display the updated information 

  - Given a user is on the *`Edit mode`* of the **`My profile`** page 
    - when the user enters invalid information 
    - when the user selects `update`
    - then the user's account should not be updated

- Delete Account 

  - Given a user is on the **`My profile`** page 
    - when the user selects `Delete account` 
    - then a confirmation modal should appear 
  
  - Given a user is on the *`delete account`* confirmation modal
    - given the user is not the last member in any of their family groups 
    - when the user selects `Yes, delete my account` 
    - then the user will be removed from all of their family groups 
    - then the user's account will be deleted 
    - then the user will be logged out of the app 
    - then the user will be redirected to the log in page 

  - Given a user is on the *`delete account`* confirmation modal
    - given the user is last member in one or more of their family group
    - when the user selects `Yes, delete my account` 
    - then the user will be removed from all of their family groups 
    - then the family groups with no more members will be deleted 
    - then the user's account will be deleted 

  - Given a user is on the *`delete account`* confirmation modal
    - given the user is not the last member in any of their family groups 
    - when the user selects `No, keep my account` 
    - then the user's account will not be deleted
    - then the modal will close 

  - Given a user has deleted their account 
    - when they attempt to log in using their credentials 
    - then they will not be able to log in
    - they will receive an invalid credentials error 

#### 2.1.2 Core Feature: Family Group: 

##### **Unit Tests**

TO COMPLETE

##### **Integration Tests**

- Create Group
  - Given valid input
    - Should create and return the new group 
  - Given a duplicate group name
    - Should create and return the new group 
  - Given invalid group name
    - Should return a validation fail status 401, and not create the group 
  - Given no group name
    - Should return a validation fail status 401, and not create the group 
- Get Group
  - Given a valid group ID
    - Should return the group 
  - Given an invalid group ID
    - Should return a status 404 
- Update Group (Add User Membership)
  - Given a valid group ID and new user email
    - Should return the group with new user added to the group 
  - Given a valid group ID and existing user email
    - Should return a status 404 and the group with no change 
  - Given a valid group ID and invalid user email
    - Should return a status 404 
  - Given an invalid group ID
    - Should return a status 404 
- Update Group (Remove User Membership)
  - Given a valid group ID and new user email
    - Given a user leaves the group and there are still members
      - Should return the group without the user in the group 
      - Given a user leaves and is the last member
        - Should remove the group from the database 
  - Given a valid group ID and invalid user email
    - Should return a user not found status 404 
  - Given an invalid group ID
    - Should return a family not found status 404

##### **Acceptance Tests**

- Create Family Group

  - Given a user is on the **`Family Groups`** page 
    - when the user selects the `Create Family Group` button
    - then the *`Create family group`* form should pop up 

  - Given a user is on the *`Create family group`* form 
    - when the user enters a family group name
    - when the user selects `Submit` 
    - then the family group should be created with the family group name 
    - then the user should be automatically added to that family group 

- Get Family Group

  - Given a user is logged in
    - given that the user is part of one or more family groups
    - when the user navigates to the **`Family Groups`** page
    - then the user should see dropdowns for each family group that they're in 
    - then each dropdown should display the name of the family group 

  - Given a user is on the **`Family Groups`** page 
    - given that the user is part of one or more family groups
    - when the user opens a family group dropdown 
    - then the dropdown should display all First + Last names of members in that family group 

  - Given a user is on the **`Family Groups`** page 
    - given that the user is not part of any family groups
    - then the page should display `"You are not part of any family groups"` 

- Update Family Group

  - Given a user has opened a family group dropdown
    - when the user selects `Add member` 
    - then the *`Add member`* modal should pop up 

  - Given a user is on the *`Add member`* modal of the **`family groups`** page 
    - when the user enters an email address of an existing member 
    - when the user selects `Submit` 
    - then the user with that email address should be added to that family group 
    - then the user's name should display in the family group's dropdown 

  - Given a user is on the *`Add member`* modal of the **`family groups`** page 
    - when the user enters an email address that is not associated to an account
    - when the user selects `Submit` 
    - then an alert should appear saying the member was not found 
    - then the family group should not be updated 
      
  - Given a user has opened a family group dropdown
    - when the user selects `Leave Group` 
    - then a modal should appear asking if the user is sure they want to leave 

  - Given a user is on the *`Leave group`* confirmation modal
    - when the user selects `Leave this group` 
    - then the user should be removed from the group 
    - then the user should not see that group's events on the calendar 
    - then the user should not see that group on the **`Family Groups`** page 
      
  - Given a user is on the *`Leave group`* confirmation modal
    - when the user selects `stay in this group` 
    - then the modal should close
    - then the user should stay in the family group 

- Delete Family Group

  - Given a user is on the *`Leave group`* confirmation modal
    - given the user is the only member in this group 
    - when the user selects `Leave this group` 
    - then the user should be removed from the group 
    - then the group should be deleted 

#### 2.1.3 Core Feature: Events / Shared Calendar: 

##### **Unit Tests**

- Create Event
  - Given valid input data
    - Should return the event 
  - Given input data without a title
    - Should throw a validation error 
  - Given input data with an invalid title
    - Should throw a validation error 
  - Given input data with an invalid recurrence rule
    - Should throw a validation error 
  - Given input data with an invalid end date
    - Should throw a custom validation error 
  - Given input data without a family group
    - Should throw a validation error 
- Get Event
  - Given a valid user ID
    - Should return the events created by that user 
    - Should return no events if none were created 
  - Given an invalid user ID
    - Should return an empty list 
  - Given a valid event ID
    - Should return the event 
  - Given an invalid event ID
    - Should return null 
  - Given a valid family group
    - Should return all events in that group 
  - Given an invalid family group
    - Should return an empty list 
- Update Event
  - Given valid input
    - Should return the updated event 
  - Given an invalid name
    - Should throw a validation error and cause no change 
  - Given an invalid recurrence rule
    - Should throw a validation error and cause no change 
  - Given invalid user permissions
    - Should cause no change 
- Delete Event
  - Given a valid ID
    - Should remove the event from the database, and return event 
  - Given an invalid ID
    - Should return an event with an undefined ID

##### **Integration Tests**

- Create Event
  - Given valid input data
    - Should return the event 
  - Given input data without a title
    - Should return a validation failed status 400 
  - Given input data with an invalid title
    - Should return a validation failed status 400 
  - Given input data with an invalid recurrence rule
    - Should return a validation failed status 400 
  - Given input data with an invalid end date
    - Should return an end date error status 400 
  - Given input data without a family group
    - Should return a validation failed status 400 
  - Given invalid input fields
    - Should create with only valid fields 
- Get Event
  - Given a valid event ID
    - Should return the event
  - Given an invalid event ID
    - Should return a status 400 
  - Given a valid user ID
    - Should return the events created by that user 
    - Should return no events if none were created, status 400 
  - Given an invalid user ID
    - Should return an empty list, status 400 
  - Given a valid family group
    - Should return all events in that group 
  - Given an invalid family group
    - Should return an empty list, status 400 
  - Given an invalid search field
    - Should return an empty list, status 400 
- Update Event
  - Given valid input
    - Should return the updated event 
  - Given no ID
    - Should return an event not found status 400 
  - Given an invalid name
    - Should return a validation failed status 400 
  - Given an invalid recurrence rule
    - Should return a validation failed status 400 
  - Given invalid user permissions
    - Should return an invalid user permissions status 400 
- Delete Event
  - Given a valid ID
    - Should remove the event from the database, and return event 
  - Given an invalid ID
    - Should return a event not found status 400 
  - Given invalid user permissions
    - Should return an invalid user permissions status 400 

##### **Acceptance Tests**

- Create Event 

  - Given a user is on the **`calendar`** page, 
    - when the user selects the `Create Event` button, 
    - then the *`Create Event`* form should appear. 

  - Given when a user is on the *`Create Event`* form, 
    - when the user enters valid event details 
    - when the user hits `Submit` 
    - then the event should be created
    - then the user should return to the calendar
    - then the calendar should display the created event on the correct date/time 
  
  - Given when a user is on the *`Create Event`* form, 
    - when the user inputs invalid data, 
    - then the event should not be created 
    - the user should stay on the *`Create Event`* form 

- Get Event 

  - Given a user is on the **`calendar`** page, 
    - when the user selects an event on the calendar, 
    - then the *`Event details`* modal should open and display the associated event's information (title, date(s), time(s), description, location) 

- Update Event 

  - Given a user is on an **`event's details`** page
    - Given the user is the event's creator, 
    - when the user selects the `Edit` button, 
    - then the *`Edit Event`* form of that event should appear. 
    - then the *`Edit Event`* form should be prefilled with the event's current information
  
  - Given a user is on an **`event's details`** page, 
    - Given the user is NOT the event's creator, 
    - then the `Edit` button should not appear 
  
  - Given when a user is on the *`Edit Event`* form, 
    - when the user enters valid event details 
    - when the user hits `Submit` 
    - then the event should be updated with the new details
    - then the user should return to the **`calendar`**
    - then the calendar should display the updated event on the correct date/time 
  
  - Given when a user is on the *`Edit Event`* form, 
    - when the user inputs invalid data, 
    - then the event should not be updated
    - the user should stay on the *`Edit Event`* form 

- Delete Event 

  - Given a user is on an **`event's details`** page,
    - Given the user is the event's creator, 
    - when the user selects the `Delete` button,
    - then the event should be deleted, 
    - the event should not appear on the calendar 
  - Given a user is on an **`event's details`** page, 
    - Given the user is NOT the event's creator, 
    - then the `Delete` button should not appear 


### 2.2 Test Completeness

Below is the criteria that will deem our testing complete: 
- 100% code coverage 
- All manual and automated test cases executed 
- All open bugs are fixed or will be fixed in next release 

#### 2.2.1 Regression Testing (Results):
![Regression-Test]() ADD IMAGE


---


## 3 Resource & Environment Needs
### 3.1 Testing Tools
- **Automation Tools**: GitHub Actions
- **Testing NodeJS libraries:** Jest, SuperTest.
- **Bug Tracking Tool:** Github
  
### 3.2 Test Environment

- Github Actions: Nodejs.
- Any browser that supports Github website.

---

## 4 Terms/Acronyms  

|**TERM** |**DEFINITION** |
| - | - |
| DB | Database|
| AUT | Application Under Test|
| CRUD | Create, Read, Update, Delete |
| API | Application Program Interface|
