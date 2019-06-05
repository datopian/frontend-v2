CKAN frontend in node.js.

[![Build Status](https://travis-ci.org/datopian/frontend-v2.svg?branch=master)](https://travis-ci.org/datopian/frontend-v2)
[![Coverage Status](https://coveralls.io/repos/github/datopian/frontend-v2/badge.svg?branch=master)](https://coveralls.io/github/datopian/frontend-v2?branch=master)

## Quick Start

Clone the repo, install dependencies using yarn (or npm) and run the server:

```bash
yarn
yarn start
```

To run in watch mode:

```bash
# note the -e which means we watch for changes in templates too
nodemon -e "js html" index.js
```

## Set up your own backend

*By default, the app runs against mocked API so you don't need to setup your own backend.*

To change environment variables, you can rename `env.template` as `.env` and set the values.

### DMS

Setup `API_URL` environment variable so it points to your CKAN instance, e.g., for demo.ckan.org it would be:

```
export API_URL=https://demo.ckan.org/api/3/action/
```

### CMS

Use `WP_URL` environment variable to point to your WordPress instance. For example, we have test wordpress blog here https://edscms.home.blog/ so it would be:

```
export WP_URL=https://edscms.home.blog/
```

## Tests

Run tests (note that tests are running against mocked API_URL set to http://127.0.0.1:5000/api/3/action/):

```bash
yarn test

# watch mode:
yarn test:watch
```
