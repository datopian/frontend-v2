FROM node:8-slim

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "yarn", "start" ]
