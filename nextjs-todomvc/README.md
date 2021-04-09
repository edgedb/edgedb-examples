# TodoMVC with EdgeDB and Next.js

## The stack

This project implements the standard [TodoMVC](https://todomvc.com/) project with Next.js and EdgeDB.

- TypeScript
- React
- [Next.js](https://nextjs.org/)
- [EdgeDB](https://edgedb.com/) (1.0.0-beta.1)
- The `edgedb` npm module ([docs](https://www.edgedb.com/docs/clients/01_js/index/))
- [Axios](https://github.com/axios/axios) for HTTP requests

### Getting started

> If you aren't famililar with EdgeDB, check out the [Getting Started](https://www.edgedb.com/docs/tutorial/index) guide first. It walks you through installing EdgeDB on your computer and gives you an overview of EdgeQL syntax.

**Clone this repo**

```sh
git clone git@github.com:edgedb/edgedb-examples.git
cd edgedb-examples/nextjs-todomvc
```

**Install EdgeDB**

First, install the `edgedb` command line tool. You can do this with a single shell command. On Linux:

```sh
# macOS and Unix
$ curl https://sh.edgedb.com --proto '=https' -sSf1 | sh

# Windows
$ iwr https://ps1.edgedb.com -useb | iex
```

Now run `edgedb server install` to install the latest version of EdgeDB to your computer. You might be asked for your password.

**Initialize the database**

Create a new EdgeDB instance called `todomvc`. Each instance can contain multiple databases.

```bash
$ edgedb server init todomvc
```

**Generate an initial migration**

Generate an initial migration with EdgeDB's interactive migration tool. Type `y` to confirm all the schema changes. You should see something like this:

```
$ edgedb -I todomvc create-migration
did you create extension 'edgeql_http'? [y,n,l,c,b,s,q,?]
y
did you create extension 'graphql'? [y,n,l,c,b,s,q,?]
y
did you create object type 'default::Task'? [y,n,l,c,b,s,q,?]
y
Created ./dbschema/migrations/00001.edgeql, id: <long id string>
```

**Execute the migration**

The previous step generated an EdgeQL migration script into `dbschema/migrations/00001.edgeql`. Now we can execute it with:

```
$ edgedb -I todomvc migrate
```

**Start the server**

`yarn dev`
