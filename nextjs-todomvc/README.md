# TodoMVC with EdgeDB and Next.js

## The stack

This project implements the standard [TodoMVC](https://todomvc.com/) project with Next.js and EdgeDB.

- TypeScript
- React
- Next.js/
- [EdgeDB](https://edgedb.com/) (1-beta.1)
- The `edgedb` NPM module ([docs](https://www.edgedb.com/docs/clients/01_js/index/))
- [react-query](https://github.com/tannerlinsley/react-query) and [Axios](https://github.com/axios/axios) for HTTP

### Getting started

> If you aren't famililar with EdgeDB, check out the [Getting Started](https://www.edgedb.com/docs/tutorial/index) guide first. It walks you through installing EdgeDB on your computer and gives you an overview of EdgeQL syntax.

### Install EdgeDB

You'll need to EdgeDB and the `edgedb` CLI installed.

If you don't already, start by downloading the CLI:

```sh
# macOS and Unix
$ curl https://sh.edgedb.com --proto '=https' -sSf1 | sh

# Windows
$ iwr https://ps1.edgedb.com -useb | iex
```

Then **restart your terminal** (so the `edgedb` command is available) and run `edgedb server install` to install the latest version of EdgeDB to your computer. You might be asked for your password.

### Download the starter project

This uses a utility called `degit` that downloads a copy of the project from GitHub without cloning it:

```sh

npx degit edgedb/edgedb-examples/nextjs-todomvc todomvc
cd todomvc
npm install # install dependencies
```

### Initialize the database

Create a new EdgeDB instance called `todomvc`. Each instance can contain multiple databases.

```bash
$ edgedb project init
```

This does a few things:

1. It installs EdgeDB if it isn't already installed on your computer.
2. It prompts you to create or select a local EdgeDB instance to be used for this project.
3. It automatically applies all migrations inside `dbschema/migrations`.

The database is now fully configured and ready for use!

### Start the server

```
yarn dev
```

Now start playing around with the code to learn how to build applications with EdgeDB!
