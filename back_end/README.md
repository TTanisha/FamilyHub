# Back End README

## Instructions

### Requirements

- For running locally without docker:

    - Make sure all dependencies are installed:  
      
      - ```npm install cors dotenv express mongodb mongoose```

    - Make sure nodemon is intalled. (-D for development) ```npm install nodemon -D``` *(runs app again when change made)*

    - Type ```npm start```

    - Or type ```npm dev``` (using nodemon)


- For creating an image locally in ./back_end/

    - ```docker build ./ -t armijosj/familyhub:server```

- For pushing an image manually **(not necessary when pulled from Docker Hub )** ( username: *armijosj* and password: *dckr_pat_D6kvLu_NbuDnl4jkJG1ubmJ5uzQ* (Actually iit is a CLI access token) )

    - ```docker push armijosj/familyhub:server```

- For pulling the image from DockerHub (After running github actions or pushing manually)

    - Type  ```docker pull armijosj/familyhub:server``` in the terminal.

- For running the Docker image (Create a container and run the server)

    - Type ```docker run -p 5000:5000 armijosj/familyhub:server``` to run the server. NOTE: the -p PORT:PORT script opens the specified port. If a change is made to the running server port, then it should also change on the run script.
