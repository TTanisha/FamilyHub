FROM node:lts-alpine
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN pnpm install

# Bundle app source
COPY . .
# Server port
EXPOSE 5000

CMD ["pnpm", "start"]