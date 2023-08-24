This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It serves as an example app that uses EdgeDB and OpenAI APIs to create chatbot for your documentation.

## Prerequisites

You should have both [Node](https://nodejs.org/en) and [EdgeDB](https://www.edgedb.com/install) installed for this project.

## Getting Started

Start by initializing the EdgeDB project:

```bash
npm run initProject
# or
yarn run initProject
# or
pnpm run initProject
```

You need to provide three environment variables:

- `OPENAI_API_KEY`: should be set to the API KEY that you created in your OpenAI profile,
- `EDGEDB_CLIENT_TLS_SECURITY`: should be set to "insecure" (and used only in development, not in prod).
- `EDGEDB_DSN`: you can get this by running `edgedb instance credentials --insecure-dsn` in the terminal.

After setting the environment variables, install the dependencies with:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Note: The install script will automatically generate the query builder and embeddings for you to get started. If you change the schema, you will need to regenerate the query builder with `npm run generateQb`. If you make changes to the documentation, you will need to regenerate the embeddings with `npm run embeddings`.

To learn how to build this app yourself, check out our guide.
