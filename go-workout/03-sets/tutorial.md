# Part 3

Part 3 picks up where
[part 2](https://github.com/edgedb/edgedb-examples/tree/main/go-workout/blob/master/02-exercise/tutorial.md)
left off.

This is the final step in this tutorial. We'll add sets (a weight and rep count).

## Schema

Sets will have a weight (lbs), rep count, and an exercise. We will also need a
consistent ordering for sets in a given workout. For that we can extend the
builtin abstract [sequence type](https://www.edgedb.com/docs/datamodel/scalars/numeric#type::std::sequence)
who's default value is auto incrementing.

```esdl
  scalar type SetIndex extending sequence;

  type Set_ {
    required link exercise -> Exercise;
    required property index -> SetIndex {
      constraint exclusive;
      constraint min_value(0);
    };
    required property weight -> float32;
    required property reps -> int16 {
      constraint min_value(0);
    };
  }
```

Next we can add a relationship between workouts and sets.

```esdl
  type Workout {
    # ...
    multi link sets -> Set_ {
      constraint exclusive;
    }
  }
```

The final `dbschema/default.esdl` looks like this.

```esdl
# dbschema/default.esdl
```

Then create a migration and apply it.

```bash
edgedb migration create
edgedb migration apply
```

## Backend

First update existing workout queries to include the workout's sets in the
selected shape. Also, note that the go result parameters are now initialized
with an empty `[]Set{}`. This makes the set field in json response payloads
default to an empty array instead of `null`.

```go
// internal/workout/workout.go
```

Sets will have only one query that inserts a new set, adds it to a workout, and
returns the entire updated workout.

```eql
WITH
  inserted := (INSERT Set_ {
    exercise := (SELECT Exercise FILTER .id = <uuid> $1 LIMIT 1),
    weight := <float32>$2,
    reps := <int16>$3,
  }),
  updated := (
    UPDATE Workout
    FILTER .id = <uuid>$0
    SET {
      sets += inserted
    }
  ),
SELECT updated {
  id,
  started_at,
  sets: {
    id,
    weight,
    reps,
    exercise: { id, name },
  } ORDER BY .index ASC,
}
```

Put the set handler in `internal/set/set.go`.

```go
// internal/set/set.go
```

And update the routs.

```go
// main.go
```

## Frontend

The only thing left to do is update the workout page.

```javascript
// frontend/src/pages/Workout.svelte
```

Tada! Check out the [finished app](http://localhost:5000)
