# Part 1

## Requirements

- [edgedb & edgedb-cli](https://www.edgedb.com/docs/tutorial/install#ref-tutorial-install)
- [go](https://golang.org/doc/install)
- [node.js](https://nodejs.org/en/)

## Setup

Create a new project directory.

```bash
mkdir edgedb-workout-tutorial
cd edgedb-workout-tutorial
```

Initialize a new EdgeDB instance. The EdgeDB server will be running when this
command exits.

```bash
edgedb project init
```

Copy a [svelte](https://svelte.dev/) app template.

```bash
npx degit fmoor/svelte-template frontend
(cd frontend && npm install)
```

Start a new go module.

```bash
go mod init github.com/myuser/edgedb-workout-tutorial
go get github.com/edgedb/edgedb-go
go get github.com/gin-gonic/gin
```

## Schema

Before writing queries we'll need a schema.
Later we will add a few more types but to get started we only need a workout type.
Workouts should know when they started and
only one workout should be able to start at a given moment.

Put the following in a new file `dbschema/default.esdl`

```esdl
module default {
  type Workout {
    required property started_at -> datetime {
      # Started_at values must be unique.
      constraint exclusive;

      # When a workout is created without an explicit started_at value,
      # started_at will default to the current time.
      default := datetime_current();
    }
  }
}
```

Now we can create a migration from the schema. You will probably have to answer
yes `y` to a few questions when you run this command.

```bash
edgedb migration create
```

This will create a new file called `dbschema/migrations/00001.edgeql`. We don't
need to worry about its contents, but migration files should be committed to
source control.

Apply the migration.

```bash
edgedb migration apply
```

We can kick the tires on our new schema in the EdgeDB cli.

```bash
edgedb
```

To create a new workout use INSERT.

```eql
edgedb> INSERT Workout;
{default::Workout {id: 18d3e7b2-8b5b-11eb-ac8c-3bce8f86356a}}
```

To query all workouts use SELECT.

```eql
edgedb> SELECT Workout { id, started_at };
{
  default::Workout {id: f89209c2-8905-11eb-ac8c-b75dafbece51, started_at: <datetime>'2021-03-19T22:53:50.309515Z'},
}
```

## Backend

Connecting to the database looks like this. This will go in `internal/db/db.go`.

```go
// internal/db/db.go
```

We will need an endpoint to create new workouts. In the cli examples above we
inserted a new workout in one query and then selected the new workout in a
second query. That was fine for demonstration purposes, but in a production
application the fewer round trips to the database the faster the application
will be. EdgeDB is able to insert and select in a single query like this.

```eql
WITH
  inserted := (INSERT Workout)
SELECT inserted {
  id,
  started_at,
};
```

This query creates a new workout with `started_at` set to the current time and
returns the result. A gin handler that executes this query would look something
like this:

```go
type Workout struct {
  ID        edgedb.UUID `edgedb:"id" json:"id"`
  StartedAt time.Time   `edgedb:"started_at" json:"started_at"`
}

func Create(c *gin.Context) {
  result := Workout{}
  err := db.Pool.QuerySingle(c, `
    WITH inserted := (INSERT Workout)
    SELECT inserted { id, started_at }`,
    &result,
  )

  if err != nil {
    log.Println(err)
    c.JSON(500, gin.H{"error": "server error"})
  } else {
    c.JSON(201, gin.H{"data": result})
  }
}
```

We will also need to fetch an existing workout by id.

```eql
SELECT Workout {
  id,
  started_at,
}
FILTER .id = <uuid>$0
LIMIT 1
```

And finally, fetch all workouts in chronological order newest first.

```eql
SELECT Workout {
  id,
  started_at,
}
ORDER BY .started_at DESC
```

Request handlers for these last two queries look very similar to the first.
Well put these three handlers in `internal/workout/workout.go`

```go
// internal/workout/workout.go
```

The last backend detail is plugging the handlers into routes. `main.go` will
look like this.

```go
// main.go
```

At this point the backend API is functional and can be run like this.

```bash
go run main.go
```

Keep in mind that you will need to stop and restart that process when you make
changes to your go code. You can use
[an auto reloader](https://github.com/codegangsta/gin#gin-) if you want
something that will build and restart you code automagically.

## Frontend

Well make the landing page be a list of all the workouts we have done.

```javascript
// frontend/src/pages/Index.svelte
```

And the page to show workout details will look like this.

```javascript
// frontend/src/pages/Workout.svelte
```

Then update the frontend routs.

```javascript
// frontend/src/routes.js
```

Run the frontend development server.

```bash
(cd frontend && npm run dev)
```

If you have both the frontend and backend servers running you'll find the UI at [http://localhost:5000](http://localhost:5000).

Help is available: If you get stuck, you can reach out to the community on
[GitHub Discussions](https://github.com/edgedb/edgedb/discussions).

When you're ready you can move on to [part 2](https://github.com/edgedb/edgedb-examples/tree/main/go-workout/blob/master/02-exercise/tutorial.md).
