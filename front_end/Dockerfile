FROM node:lts-alpine
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .
# Server port
EXPOSE 5173

CMD ["npm", "run", "dev"]