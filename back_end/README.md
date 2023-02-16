# Back End README

## Instructions

# Running Test suite:
 - Type:
    ```
    npm test
    ```

# Running locally without docker:

- Make sure all dependencies are installed:  
      
    ```
    npm install cors dotenv express mongodb mongoose
    ```

- Make sure nodemon is installed. (-D for development) *(runs app again when change made)*

    ```
    npm install nodemon -D
    ``` 
- Run either:
    ```
    npm start
    ```
    ```
    npm dev
    ``` 
    (using nodemon)


# Using Docker
- For creating an image locally in ./back_end/

    ```
    docker build ./ -t armijosj/familyhub:server
    ```

- For pushing an image manually **(not necessary when pulled from Docker Hub )** ( username: *armijosj* and password: *dckr_pat_D6kvLu_NbuDnl4jkJG1ubmJ5uzQ* (Actually iit is a CLI access token) )

    ```
    docker push armijosj/familyhub:server
    ```

- For pulling the image from DockerHub (After running github actions or pushing manually)

    ```
    docker pull armijosj/familyhub:server
    ``` 

- For running the Docker image (Create a container and run the server)
    ```
    docker run -p 8080:8080 armijosj/familyhub:server
    ```
    
- NOTE: the -p PORT:PORT script opens the specified port. If a change is made to the running server port, then it should also change on the run script.
