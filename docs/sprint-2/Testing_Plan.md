# TEST PLAN FOR FamilyHub

***Note that we are going to refine our testing plan as the project development goes. The change log is as follow:*** 

*ChangeLog* 

|**Version**  |**Change Date** |**By** |**Description** |
| - | - | - | - |
|`V1` |Feb 16, 2023 |Juan Armijos |**Reviewers:** Everyone. |

---

## 1 Introduction

### 1.1 Scope 

This is our testing scope for Sprint 2:
1. Shared Calendar
    - View the shared calendar in a monthly view
    - Navigate through the calendar (view previous, next, and today’s month)  
    - Create events on the backend

2. Family Member Profiles
    - Create an account
    - Log in into an account
    - Update Profile details

### 1.2 Roles and Responsibilities

|**Name** |**Net ID** |**GitHub username** |**Role** |
| - | - | - | - |
|Freyja Kristjanson  |kristjaf |@FreyjaKristjanson | Backend Developer, DB Manager |
|Jasmine Tabuzo |tabuzoj |@jasmine-tabuzo  |Full-stack developer |
|Juan Armijos  |armijosj | @armijos | Configuration Manager, Installation Team |
|Tanisha Turner  |turnert1 | @TTanisha |Fronten Developer |


--- 

## 2 Test Methodology 

### 2.1 Test Levels

#### Core Feature: User Profile: 

**Unit tests:**
- Registration
    1. Register valid user results in success.
    2. Register user with duplicate email results in error.
    3. Regster without name results in error.
    4. Register without passsword results in error.
    5. Register with an invalid password results in error.
    6. Register with an invalid first name results in error.
    7. Register valid user with all required and non-required fields, results in success.

- Logging in
    1. Find valid user by email and password.
    2. Valid email, invalid password
    3. Pass a non existent user.

- Update
    1. Successfully update required user parameters
    2. Successfully update non-required user parameters
    3. Invalid update parameters
    4. Duplicate email update
    5. Pass a non existent user.

- Delete
    1. Successfully find and delete user
    2. No such user

**Integration test:**
- /registerUser
    1. Register valid user results in success.
    2. Register user with duplicate email results in error.
    3. Regster without name results in error.
    4. Register without passsword results in error.
    5. Register with an invalid password results in error.
    6. Register with an invalid first name results in error.
    7. Register with all required and non-required fields, results in success.

- /getUserById
    1. Find valid user by ID.

- /getUser
    1. Find valid user by email and password.
    2. Valid email, invalid password
    3. Pass a non existent user.

- /updateUser
    1. Successfully update required user parameters
    2. Successfully update non-required user parameters
    3. Invalid update parameters
    4. Duplicate email update
    5. Pass a non existent user.

- /deleteUser
    1. Successfully find and delete user
    2. No such user
    3. Invalid user permissions

#### Core Feature: Family Group: 

**Unit tests:**
- Create
- Retrieve
- Add Member

**Integration test:**
- /createFamilyGroup
- /getFamilyGroup
- /getFamilyGroup
- /addMemberToFamilyGroup


#### Core Feature: Shared Calendar: 

**Unit tests:**
- Create Event
    1. Create a new event
    2. Create an event with no title
    3. Create an event with an invalid title
    4. Create an event with an invalid recurrence rule

- Get Event
    1. Find event by user.
    2. Find event by ID
    3. Pass a non existent event ID.

- Update
    1. Update event name
    2. Invalid event name change
    3. Invalid recurrence rule change
    4. Invalid user permissions

- Delete
    1. Successfully find and delete event
    2. No such event


**Integration test:**
- /createEvent
    1. Create a new event
    2. Create an event with no title
    3. Create an event with an invalid title
    4. Create an event with an invalid recurrence rule

- /getEventById
    1. Find event by user.
    2. Find event by ID
    3. Pass a non existent event ID.
- /getEvents
    1. Get all events given the family group.

- /updateEvent
    1. Update event name
    2. Invalid event name change
    3. Invalid recurrence rule change
    4. Invalid user permissions

- /deleteEvent
    1. Successfully find and delete event
    2. No such event


#### Regression Testing (Results):
![Regression-Test](./Regression%20Testing.png)


### 2.2 Test Completeness

To implement in **(SPRINT 3)**. 


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
