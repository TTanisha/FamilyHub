FROM node:lts-alpine
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
# Server port
EXPOSE 5000

CMD ["npm", "start"]