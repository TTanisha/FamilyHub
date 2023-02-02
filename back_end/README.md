# Back End README

## Instructions

### Requirements

- For running locally wihtout docker:

    - Make sure express is intalled.```pnpm install express```

    - Make sure nodemon is intalled. (-D for development) ```pnpm install nodemon -D``` *(runs app again when change made)*

    - Type ```pnpm start```

    - Or type ```pnpm dev``` (using nodemon)


- For creating an image locally **(not necessary when pulled from Docker Hub )** 

    - ```docker build ./back_end -t armijosj/familyhub:server```

- For pushing an image manually **(not necessary when pulled from Docker Hub )** ( username: *armijosj* and password: *dckr_pat_D6kvLu_NbuDnl4jkJG1ubmJ5uzQ* (Actually iit is a CLI access token) )

    - ```docker push armijosj/familyhub:server```

- For pulling the image from DockerHub (After running github actions or pushing manually)

    - Type  ```docker pull armijosj/familyhub:server``` in the terminal.

- For running the Docker image (Create a container and run the server)

    - Type ```docker run -p 5000:5000 armijosj/familyhub:server``` to run the server.