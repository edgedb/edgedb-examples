# TodoMVC with EdgeDB and Next.js

## The stack

This project implements the standard [TodoMVC](https://todomvc.com/) project with Next.js and EdgeDB.

- TypeScript
- React
- Next.js
- [EdgeDB](https://edgedb.com/) (2.0)
- The `edgedb` NPM module ([docs](https://www.edgedb.com/docs/clients/01_js/index/))
- [react-query](https://github.com/tannerlinsley/react-query) for fetching
- [Axios](https://github.com/axios/axios) for HTTP

### Getting started

If you aren't famililar with EdgeDB, check out the [Quickstart](https://www.edgedb.com/docs/tutorial/index) first. It will walk you through how to install EdgeDB, set up an instance, and write some simple queries.

### Download the starter project

This uses a utility called `degit` that downloads a copy of the project from GitHub without cloning it:

```sh
cd ~/Documents
npx degit edgedb/edgedb-examples/nextjs-todomvc todomvc
cd todomvc
npm install # install dependencies
```

### Initialize the project

```bash
$ edgedb project init
```

This does a few things:

1. It installs EdgeDB if it isn't already installed on your computer.
2. It prompts you to create or select a local EdgeDB instance to be used for this project.
3. It automatically applies all migrations inside `dbschema/migrations`.

The database is now fully configured and ready for use!

### Start the server

Start the server.

```bash
$ yarn dev
```

Then go to [localhost:3000](http://localhost:3000), and creating some todos, and start looking through the code to learn how to build applications with EdgeDB!
