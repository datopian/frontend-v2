FROM node:8-slim

# Create app directory
WORKDIR /usr/src/app

COPY . .
# Need to install nodemon globally to make it work.
# Note we're using nodemon for dev purposes.
RUN yarn global add nodemon

# You can setup env vars here or via `.env` file


EXPOSE 3000

# For staging/production please use `yarn start` command.
CMD [ "yarn", "dev" ]
