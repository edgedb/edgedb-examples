This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

It serves as an example app that uses EdgeDB and OpenAI APIs to create chatbot for your documentation.

## Getting Started

You need to provide two environment variables:

- `OPENAI_API_KEY`: should be set to the API KEY that you created in your
  OpenAI profile,

- `TLS_SECURITY`: should be set to "insecure" (and used only in development,
  not in prod).

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

To learn how to build this app yourself, check out our guide.
