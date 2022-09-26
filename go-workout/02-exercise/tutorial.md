# Part 2

This section assumes that you have finished
[part 1](https://github.com/edgedb/workout-tutorial/blob/master/01-workouts/tutorial.md).

So far the app only has workouts, but no way to record sets of exercises. We'll
add exercises to our data model now and then in the next section we'll tie
everything together by adding sets.

## Schema

We'll add an Exercise type to `dbschema/default.esdl`.

```esdl
module default {
  type Workout {
    required property started_at -> datetime {
      constraint exclusive;
      default := datetime_current();
    }
  }

  type Exercise {
    required property name -> str {
      constraint exclusive;
      constraint min_len_value(1);
    }
  }
}
```

Empty exercise names would make for bad UX later so `constraint min_len_value(1)`
is added so that exercise names must be at least 1 character.
A production application might want to define stricter
[constraints](https://www.edgedb.com/docs/datamodel/constraints#constraints)
perhaps preventing white space only names etc.

Don't forget to create a migration and apply it.

```bash
edgedb migration create
edgedb migration apply
```

## Backend

We'll make the create exercise query insert a new exercise and return the full
list of exercises. This pattern will work nicely in the frontend later.

```eql
WITH
  inserted := (
    INSERT Exercise {
      name := <str>$0
    }
  ),
  all := (inserted UNION (SELECT Exercise)),
SELECT DISTINCT (all { name })
ORDER BY .name ASC`,
```

Note that EdgeQL requires that your sub queries are used in the top level
statement. This means that even though the union in
`all := (inserted UNION (SELECT Exercise))` is redundant because
`SELECT Exercise` already selects all exercises it must be there so that
`inserted` is used somewhere.

Renaming an exercise will follow a similar pattern.

```eql
WITH
  updated := (
    UPDATE Exercise
    FILTER .id = <uuid>$0
    SET {
      name := <str>$1
    }
  ),
  all := (updated UNION (SELECT Exercise)),
SELECT DISTINCT all {
  id,
  name,
}
ORDER BY .name ASC`,
```

The fetch all exercises query is very similar to it's workout counter part.

```eql
SELECT Exercise {
  id,
  name,
}
ORDER BY .name ASC`,
```

These queries and their respective handlers will go in `internal/exercise/exercise.go`.

```go
// internal/exercise/exercise.go
```

Then update the routing.

```go
// main.go
```

## Frontend

We'll add a new page to enable creating and editing exercises.

```javascript
// frontend/src/pages/Exercise.svelte
```

Update the routing.

```javascript
// frontend/src/routes.js
```

And we'll add a simple navbar.

```javascript
// frontend/src/App.svelte
```

Don't forget to restart your go server if you're managing that manually. Then
checkout the new [exercises page](http://localhost:5000/exercises).

The final section [part 3](https://github.com/edgedb/workout-tutorial/blob/master/03-sets/tutorial.md)
is next.
