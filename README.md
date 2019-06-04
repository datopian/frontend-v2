CKAN frontend in node.js.

[![Build Status](https://travis-ci.org/datopian/frontend-v2.svg?branch=master)](https://travis-ci.org/datopian/frontend-v2)

## Quick Start

Clone the repo, install dependencies using yarn (or npm), set environment variables and run the server:

```bash
yarn
cp env.template .env # add your env vars
yarn start
```

To run in watch mode:

```bash
# note the -e which means we watch for changes in templates too
nodemon -e "js html" index.js
```

Run tests (note that tests are running against mocked API_URL set to http://127.0.0.1:5000/api/3/action/):

```bash
yarn test

# watch mode:
yarn test:watch
```
