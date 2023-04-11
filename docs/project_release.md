# FamilyHub Release Summary

## Team members 

| Member             | GitHub ID          | Email                   | Role | 
|--------------------|--------------------|-------------------------|---|
| Freyja Kristjanson | @FreyjaKristjanson | kristjaf@myumanitoba.ca |Backend Developer, DB Manager|
| Jasmine Tabuzo     | @jasmine-tabuzo    | tabuzoj@myumanitoba.ca  |Full-stack developer|
| Juan Armijos       | @armijosj          | armijosj@myumanitoba.ca |Configuration Manager, Installation Team|
| Tanisha Turner     | @TTanisha          | turnert1@myumanitoba.ca |Frontend Developer|


## Project summary

1. Elevator pitch description at a high-level. 
2. Highlight the differences between the final version and proposal if applicable

## GitHub repository Link

https://github.com/TTanisha/FamilyHub

## DockerHub repository link 

1. **DockerHub link:** [Docker - FamilyHub](https://hub.docker.com/repository/docker/armijosj/familyhub/general)

2. **Instructions:**

    In a terminal run the following commands:
    ```
    docker pull armijosj/familyhub:server
    docker run -p 8080:8080 armijosj/familyhub:server
    ```

    In a different terminal:
    ```
    docker pull armijosj/familyhub:client
    docker run -p 5173:5173 armijosj/familyhub:client
    ```

    You can now access FamilyHub at ```http://localhost:5173/```

    *NOTE:* Run server before running client. 


## List of user stories for each sprint

Example: US #1: US name [Status: Done, Removed, Pushed]

### Sprint 1

- Sprint 1 was used for planning.

### Sprint 2 

- US [#53](https://github.com/TTanisha/FamilyHub/issues/53): Sign Into Account [Status: Done]

- US [#51](https://github.com/TTanisha/FamilyHub/issues/51): Create an Account [Status: Done]

- US [#20](https://github.com/TTanisha/FamilyHub/issues/20): Delete Individual Profile [Status: Pushed]

- US [#52](https://github.com/TTanisha/FamilyHub/issues/52): Delete an Account [Status: Pushed]

- US [#54](https://github.com/TTanisha/FamilyHub/issues/54): Sign Out of Account [Status: Pushed]

- US [#56](https://github.com/TTanisha/FamilyHub/issues/56): Edit Personal Information [Status: Pushed]

- US [#55](https://github.com/TTanisha/FamilyHub/issues/55): Add Personal Information [Status: Pushed]

- US [#63](https://github.com/TTanisha/FamilyHub/issues/63): Edit Personal Information [Status: Pushed]


### Sprint 3 

- US [#20](https://github.com/TTanisha/FamilyHub/issues/20): Delete Individual Profile [Status: Done]

- US [#21](https://github.com/TTanisha/FamilyHub/issues/21):Invite Family Members to group [Status: Done]

- US [#22](https://github.com/TTanisha/FamilyHub/issues/22):Create Family Group [Status: Done]

- US [#23](https://github.com/TTanisha/FamilyHub/issues/23):Leave Family Group [Status: Done]

- US [#52](https://github.com/TTanisha/FamilyHub/issues/51): Delete an Account [Status: Done]

- US [#54](https://github.com/TTanisha/FamilyHub/issues/54): Sign Out of Account [Status: Done]

- US [#55](https://github.com/TTanisha/FamilyHub/issues/55): Add Personal Information [Status: Done]

- US [#56](https://github.com/TTanisha/FamilyHub/issues/56): Edit Personal Information [Status: Done]

- US [#63](https://github.com/TTanisha/FamilyHub/issues/63): Edit Personal Information [Status: Done]

### Sprint 4 

- All User stories were completed in Sprint 3.

### Release

- All User stories were completed in Sprint 3.


## User manual

Provide instructions on how to run the application for each core feature. 

## Overall Architecture and Design

- [Architecture Diagram](docs/sprint-1/architecture-diagram.png)
- [Sequence Diagrams](docs/sprint-2/Sequence%20Diagrams/)
  - [User Profile](./docs/sprint-2/Sequence%20Diagrams/profile-page-sequence-diagram.png)
  - [Family Group](./docs/sprint-2/Sequence%20Diagrams/family-group-sequence-diagram.png)
  - [Shared Calendar](./docs/sprint-2/Sequence%20Diagrams/shared-calendar-sequence-diagram.png)  

## Infrastructure

For each library, framework, database, tool, etc

- **JavaScript**
- **Axios** - handling HTTP requests
- **Docker** - deployment
- **GitHub Actions** - CI/CD pipeline implementation
- **Prettier** - code formatter to force a consistent style

#### Front End

- **React** - library for implementing a user interface
- **Vite** - build tool 
- **ToastUI** - javascript calendar API 
- **NextUI** - react ui library for buttons, navbar, etc. 
- **HTML** and **CSS**

#### Back End

- **Node.js** - javascript runtime environment 
- **Express.js** - API framework
- **MongoDB** - data storage
- **mongoose** - library to easily connect mongoDB to Node.js

#### Testing

- **Jest** - for unit and integration tests
- **Artillery** - load testing
- **CodeQL** - security analysis


### Name and link
1 paragraph description of why you are using this framework, not other alternatives and why you didn’t choose them.

### Name Conventions
List your naming conventions or just provide a link to the standard ones used online.

For example: Java naming conventions
### Code
Key files: top 5 most important files (full path). We will also be randomly checking the code quality of files. Please let us know if there are parts of the system that are stubs or are a prototype so we grade these accordingly.
File path with a clickable GitHub link	Purpose (1 line description)

| File Path | Purpose | 
| --------- | ------- |
|           |         |
|           |         |
|           |         |
|           |         |
|           |         |

## Continuous Integration and deployment (CI/CD)
1) Describe your CI/CD environment and the clickable link to your CI/CD pipeline. For instance, if you use GitHub Action, provide the link to the workflow; if you use Jenkins, provide the link to the pipeline file. 
2) Snapshots of the CI/CD execution. Provide one for CI and one for CD to demo your have successfully set up the environment. 


## Testing

### Link to Testing Plan


### Unit / Integration / Acceptance Tests

Each story needs a test before it is complete. In other word, the code coverage (in terms of statements) should be 100%. If some class/methods are missing unit tests, please describe why and how you are checking their quality. Please describe any unusual/unique aspects of your testing approach.

#### 10 Most Important Unit Tests 

(if there are more than one unit tests in one test file, indicate clearly).

| Test File Path | What it is Testing | 
| -------------- | ------------------ |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |


#### 5 Most Important Integration Tests  

| Test File Path | What it is Testing | 
| -------------- | ------------------ |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |


#### 5 Most Important Acceptance Tests 

| Test File Path | What it is Testing | 
| -------------- | ------------------ |
|                |                    |
|                |                    |
|                |                    |
|                |                    |
|                |                    |


### Regression testing

1. Describe how you run the regression testing (e.g., which tests are executed for regression testing and which tool is used?). 
2. Provide the link to regression testing script and provide last snapshot of the execution and results of regression testing. 


### Load testing

1. Describe the environment for load testing, such as tool, load test cases.  
2. Provide the test report for load testing. 
3. Discuss one bottleneck found in the load testing. 
   
For instance, if you use Jmeter, please upload the jmx file on GitHub and provide link. Also a snapshot of the results, discuss whether the load testing is passed or not.  

### Security Analysis

1. Describe the choice of the security analysis tool and how do you run it. The security analysis tool should analyze the language that is used in the majority of your source code. 
2. Attach a report as an appendix below from static analysis tools by running the security analysis tool on your source code. Randomly select 5 detected problems and discuss what you see. Note that you are not required to fix the alarms (bugs and vulnerabilities) in the course.
