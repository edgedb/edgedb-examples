# Cloudflare Workers with EdgeDB — Example

## Local development

Set env variables in the `wrangler.toml` file.

```
EDGEDB_DSN=
```

You can obtain your EdgeDB DSN from the command line by running:

```sh
$ edgedb instance credentials --insecure-dsn
```

Install dependencies:

```sh
pnpm i # npm i # yarn
```

Start Worker locally:

```sh
npx wrnagler dev
```

## Deployment

```sh
npx wrnagler deploy
```
