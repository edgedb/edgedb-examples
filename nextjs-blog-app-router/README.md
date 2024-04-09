This is a sample project demonstrating how to use [EdgeDB](https://www.edgedb.com) inside a Next.js project.

For the step-by-step tutorial associated with this project, refer to [edgedb.com/docs/guides/tutorials/nextjs_app_router](https://docs.edgedb.com/guides/tutorials/nextjs_app_router)

Install dependencies

```bash
pnpm i
# or yarn
# or npm i
```

Initialize project

```bash
edgedb project init
```

Generate query builder

```bash
npx @edgedb/generate edgeql-js
```

Start dev server

```bash
pnpm dev
# or yarn dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
