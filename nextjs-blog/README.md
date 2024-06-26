This is a sample project demonstrating how to use [EdgeDB](https://www.edgedb.com) inside a Next.js project.

For the step-by-step tutorial associated with this project, refer to [edgedb.com/docs/guides/tutorials/nextjs_pages_router](https://docs.edgedb.com/guides/tutorials/nextjs_pages_router)

## Getting Started

Install dependencies

```bash
npm install
```

Initialize project

```bash
edgedb project init
```

Generate query builder

```bash
npx @edgedb/generate edgeql-js
```

Seed the database

```bash
npm run seed
```

Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
