package workout

import (
	"log"
	"time"

	"github.com/edgedb/edgedb-examples/go-workout/internal/db"
	"github.com/edgedb/edgedb-examples/go-workout/internal/exercise"
	"github.com/edgedb/edgedb-go"
	"github.com/gin-gonic/gin"
)

type Workout struct {
	ID        edgedb.UUID `edgedb:"id" json:"id"`
	StartedAt time.Time   `edgedb:"started_at" json:"started_at"`
	Sets      []Set       `edgedb:"sets" json:"sets"`
}

type Set struct {
	ID       edgedb.UUID       `edgedb:"id" json:"id"`
	Workout  Workout           `edgedb:"workout" json:"workout"`
	Exercise exercise.Exercise `edgedb:"exercise" json:"exercise"`
	Weight   float32           `edgedb:"weight" json:"weight"`
	Reps     int16             `edgedb:"reps" json:"reps"`
}

// Create inserts a new workout and returns the newly inserted
// workout with all of it's fields.
func Create(c *gin.Context) {
	result := Workout{Sets: []Set{}}
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

// Read looks up a workout by it's id.
func Read(c *gin.Context) {
	result := Workout{Sets: []Set{}}
	err := db.Pool.QuerySingle(c, `
		SELECT Workout {
			id,
			started_at,
			sets: {
				id,
				weight,
				reps,
				exercise: { id, name },
			} ORDER BY .index ASC,
		}
		FILTER .id = <uuid><str>$0
		LIMIT 1`,
		&result,
		c.Param("id"),
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
	} else {
		c.JSON(200, gin.H{"data": result})
	}
}

// ReadMany looks up all workouts in chronological order newest first.
func ReadMany(c *gin.Context) {
	results := []Workout{}
	err := db.Pool.Query(c, `
		SELECT Workout { id, started_at }
		ORDER BY .started_at DESC`,
		&results,
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
	} else {
		c.JSON(200, gin.H{"data": results})
	}
}
