FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# You can setup env vars here or via `.env` file

RUN yarn
EXPOSE 3000

# For staging/production please use `yarn start` command.
CMD [ "yarn", "dev" ]