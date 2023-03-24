# FamilyHub
--------------

## Team Members
| Member             | GitHub ID          | Email                   |
|--------------------|--------------------|-------------------------|
| Freyja Kristjanson | @FreyjaKristjanson | kristjaf@myumanitoba.ca |
| Jasmine Tabuzo     | @jasmine-tabuzo    | tabuzoj@myumanitoba.ca  |
| Juan Armijos       | @armijosj          | armijosj@myumanitoba.ca |
| Tanisha Turner     | @TTanisha          | turnert1@myumanitoba.ca |

---

## Sprint 3 Documentation Update

Updated Testing Plan: [Testing Plan for FamilyHub](./docs/sprint-3/Testing_Plan.md)

Updated Shared Calendar Sequence Diagram: [Shared Calendar](./docs/sprint-3/sequence-diagram-shared-calendar-v2.png)

## Sprint 2 Documentation

Testing Plan: [Testing Plan for FamilyHub](./docs/sprint-2/Testing_Plan.md)

Sequence Diagrams for:
* [User Profile](./docs/sprint-2/profile-page-sequence-diagram.png)
* [Family Group](./docs/sprint-2/family-group-sequence-diagram.png)
* [Shared Calendar](./docs/sprint-2/shared-calendar-sequence-diagram.png)

---

## Resources:
* [Project Proposal](./docs/Project_Proposal.md)

---
## Running FamilyHub:

### Prerequisites:
* Docker.


### Front End AND Back End using Docker

In the repository directory type:

- For building images, creating containers and running them:

    ```
    docker-compose up --build
     ```

- For building images, creating containers but not running them:

    ```
    docker-compose up --build --no-start
    ```


### Only Front End

Inside **./front_end/** directory, type:

- Using docker:
    - Create the image:

        ```
        docker build ./ -t armijosj/familyhub:client
        ```

    - Run the image

        ```
        docker run -p 5173:5173 armijosj/familyhub:client
        ```

- Using npm:

    ``` 
    npm install
    npm run dev
    ```

- Using pnpm:

   ```
    pnpm install
    pnpm run dev
   ```

### Only Back End

Inside **./back_end/** directory, type:

- Using docker:

    - Create the image:

        ```
        docker build ./ -t armijosj/familyhub:server
        ```

    - Run the image

        ```
        docker run -p 8080:8080 armijosj/familyhub:server
        ```

- Using npm:

    ``` 
    npm install
    npm run dev
    ```

---
