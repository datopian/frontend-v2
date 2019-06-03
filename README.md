CKAN frontend in node.js.

[![Build Status](https://travis-ci.org/datopian/frontend-v2.svg?branch=master)](https://travis-ci.org/datopian/frontend-v2)

## Quick Start

Clone the repo, install dependencies using yarn (or npm), and run the server:

```bash
yarn
yarn start
```

To run in watch mode:

```bash
# note the -e which means we watch for changes in templates too
nodemon -e "js html" index.js
```

Run tests:

```bash
yarn test

# watch mode:
yarn test:watch
```
