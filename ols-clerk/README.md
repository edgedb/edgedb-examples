# EdgeDB + Clerk + Next.js Starter

This example demonstrates how to use EdgeDB's new object-level security features. To simplify the authorization part, we've modified an example project using [Clerk](https://www.clerk.dev) and [Next.js](https://nextjs.org).

## Get started

Download the source code of this sample project with [`degit`](https://github.com/Rich-Harris/degit).

```sh
$ npx degit edgedb/edgedb-examples/clerk-ols
$ cd clerk-ols
```

Install the dependencies

```sh
$ npm install
```

Install the [EdgeDB CLI](https://www.edgedb.com/install) the initialize the project.

```sh
$ edgedb project init
```

Generate the [EdgeDB query builder](https://www.edgedb.com/docs/clients/01_js/querybuilder).

```sh
npx edgeql-js
```

Start the server

```bash
$ yarn dev
```
