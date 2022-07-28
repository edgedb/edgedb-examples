# SvelteKit with EdgeDB

This project is based on the SvelteKit default template (via [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte)) and has been modified to use EdgeDB instead of the Svelte API.

- [SvelteKit Docs](https://kit.svelte.dev/docs)
- [EdgeDB Docs](https://www.edgedb.com/docs)

## Developing

[Install](https://www.edgedb.com/install) the `edgedb` CLI if you haven't already.

Then from your terminal:

```bash
npm install             # install dependencies
edgedb project init     # initialize EdgeDB
npx edgeql-js           # generate query builder
```

Then start the development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
