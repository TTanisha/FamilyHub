# Acceptance Tests 

All acceptance tests are done manually. 

- [User Profile](#user-profile)
- [Family Group](#family-group)
- [Events / Shared Calendar](#events--shared-calendar)

### User Profile

- Create Account 
  
  - Given a user is on the **`home`** page, 
    - when the user selects `Create an account` 
    - then the user should be redirected to the sign up page 

  - Given a user is on the  **`sign up`** page 
    - when the user enters all valid information (first name, last name, email, password, birthday) 
    - when the user selects `Create account` 
    - then their account should be created with the correct information 
    - then the user should be logged in
    - then the user should be redirected to the calendar page

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

### Family Group

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


### Events / Shared Calendar 

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
