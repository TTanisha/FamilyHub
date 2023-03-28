<div align="center">

# FamilyHub

[![Push image to Docker Hub](https://github.com/TTanisha/FamilyHub/actions/workflows/push-image.yml/badge.svg)](https://github.com/TTanisha/FamilyHub/actions/workflows/push-image.yml)
[![Regression Testing](https://github.com/TTanisha/FamilyHub/actions/workflows/regression-testing.yml/badge.svg)](https://github.com/TTanisha/FamilyHub/actions/workflows/regression-testing.yml)

--------------

</div>

FamilyHub is a web-based application designed to help families stay on top of important events with their loved ones through the use of a shared calendar. This application aims to reduce friction and conflict within families by enabling them to improve their organization and communication of events. Thus, FamilyHub will help bring families closer together by giving them an avenue to stay connected, share memories, plan events, and build stronger bonds.

--------------

## Team Members
| Member             | GitHub ID          | Email                   |
|--------------------|--------------------|-------------------------|
| Freyja Kristjanson | @FreyjaKristjanson | kristjaf@myumanitoba.ca |
| Jasmine Tabuzo     | @jasmine-tabuzo    | tabuzoj@myumanitoba.ca  |
| Juan Armijos       | @armijosj          | armijosj@myumanitoba.ca |
| Tanisha Turner     | @TTanisha          | turnert1@myumanitoba.ca |

---

### Table of Contents

- [Core Features](#core-features)
- [Documentation](#documentation)
  - [Sprint 1](#sprint-1)
  - [Sprint 2](#sprint-2)
  - [Sprint 3](#sprint-3)
  - [Sprint 4](#sprint-4)
  - [Presentations](#presentations)
- [Usage](#usage)
  - [Run with Docker](#run-with-docker)
  - [Run Local](#run-locally)
- [Tests](#tests)
  - [Unit and Integration](#unit-and-integration)
  - [Acceptance Tests](#acceptance-tests)
  - ~~[Load Tests](#load-tests)~~

## Core Features

#### User Profile 

- Create an account using an email and password.
- Sign-out and sign back in at a later time.
- Stay signed-in and be remembered.
- Add and edit personal information, including name, pronouns, birthday, email, cell and home phone numbers, and address. 
- Delete your account. 

#### Family Groups

- Create a family group.
- Invite other users to join your family group. 
- Leave a family group. 


#### Shared Calendar

- View the calendar by month, week, or day. 
- View events from any combination of family groups that you are a part of. 
- Add, edit, and delete events within a specific family calendar. 

## Documentation 

```
|
|
```

- ~~[Project Release](docs/sprint-4/project_release.md)~~
- ~~[Coding Style](docs/sprint-4/coding_style.md)~~
- [Meeting Minutes](https://github.com/TTanisha/FamilyHub/wiki/Meeting-Minutes)

### Sprint 1

- [Meeting Minutes](https://github.com/TTanisha/FamilyHub/wiki/Meeting-Minutes#sprint-1)
- [Project Proposal](docs/sprint-1/Project_Proposal.md)
- [Architecture Diagram](docs/sprint-1/architecture-diagram.png)

### Sprint 2

- [Meeting Minutes](https://github.com/TTanisha/FamilyHub/wiki/Meeting-Minutes#sprint-2)
- [Testing Plan](docs/sprint-2/Testing_Plan.md)
- [Sequence Diagrams](docs/sprint-2/Sequence%20Diagrams/)
  - [User Profile](./docs/sprint-2/Sequence%20Diagrams/profile-page-sequence-diagram.png)
  - [Family Group](./docs/sprint-2/Sequence%20Diagrams/family-group-sequence-diagram.png)
  - [Shared Calendar](./docs/sprint-2/Sequence%20Diagrams/shared-calendar-sequence-diagram.png)   

### Sprint 3

- [Meeting Minutes](https://github.com/TTanisha/FamilyHub/wiki/Meeting-Minutes#sprint-3)
- [Testing Plan](docs/sprint-3/Testing_Plan.md)
- [Sequence Diagrams](docs/sprint-3/sequence-diagram-shared-calendar-v2.png)


### Sprint 4

- [Meeting Minutes](https://github.com/TTanisha/FamilyHub/wiki/Meeting-Minutes#sprint-4)
- [Coding Style](docs/sprint-4/coding_style.md)
- ~~[Load Testing Results](docs/sprint-4/)~~
- ~~[Security Analysis Results](docs/sprint-4/)~~

## Presentations 

- [Project Proposal](docs/presentations/Project_Proposal.pptx)
- [Technique Seminar](docs/presentations/Technique_Seminar.pptx)
- ~~[Final Project](docs/presentations/)~~

## Usage 

### Build and Run Images Locally (recommended)

Have docker running, then in the repository directory:
```
docker-compose up --build
```

### Pull and Run Images from Docker Hub

You don't need to have previously cloned the repository for the following steps, but you must be logged in to Docker Hub.

In a terminal:
```
docker pull armijosj/familyhub:server
docker run -p 8080:8080 armijosj/familyhub:server
```

In a different terminal:
```
docker pull armijosj/familyhub:client
docker run -p 5173:5173 armijosj/familyhub:server
```

Note: Run server before running client.

### Run Locally 

Inside the **`./src/back_end/`** directory (in a terminal):
``` 
npm install
npm run dev
```

Inside the **`./src/front_end/`** directory (in a separate terminal):
``` 
npm install
npm run dev
```

## Tests

Code directory:
```
./src/back_end/test
```

### Unit and Integration 

Inside the **`./src/back_end/`** directory:
```
npm test [for all tests]
npm test -- unit/models [for just unit tests]
npm test -- integration [for just integration tests]
npm test -- {user.test.js | event.test.js | familyGroup.test.js} [for a specific core feature]
```

### Acceptance Tests

All acceptance tests are done manually. 

See [this](back_end/test/acceptance_tests.md) document for detailed instructions. 

### Load Tests

See [this]() directory for our load test results. 

---
