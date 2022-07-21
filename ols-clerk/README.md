# Object-level security with Clerk + Next.js Starter

This example demonstrates how to use EdgeDB's new [object-level security](https://www.edgedb.com/docs/datamodel/ols) features. To simplify the authorization part, we've modified an example project using [Clerk](https://www.clerk.dev) for user management.

## Get started

Download the source code of this sample project with [`degit`](https://github.com/Rich-Harris/degit).

```sh
$ npx degit edgedb/edgedb-examples/ols-clerk
$ cd ols-clerk
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
