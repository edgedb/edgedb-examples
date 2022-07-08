# EdgeDB + Fresh

![fresh logo](static/logo.svg)

This is a demo project showcasing how to use EdgeDB in a Deno Fresh project. It renders a single route (implemented in `routes/index.tsx`) that displays a counter. The value of this counter can be incremented/decremented and is persisted in EdgeDB.

### Usage

Download a copy of this project locally.

```
npx degit edgedb/edgedb-examples/deno-fresh edgedb-fresh
cd edgedb-fresh
```

Install [the EdgeDB CLI](https://www.edgedb.com/install), then initialize an EdgeDB project.

```
edgedb project init
```

Then start the server.

```
deno task start
```

This will start a webserver listening at http://localhost:8000. When you modify file, the server will hot reload automatically.
