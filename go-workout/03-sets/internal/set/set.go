package set

import (
	"encoding/json"
	"log"

	"github.com/edgedb/workout-tutorial/internal/db"
	"github.com/edgedb/workout-tutorial/internal/workout"
	"github.com/gin-gonic/gin"
)

// Create inserts a new set, adds it to a workout and returns the updated workout.
func Create(c *gin.Context) {
	var payload workout.Set
	err := json.NewDecoder(c.Request.Body).Decode(&payload)
	if err != nil {
		log.Println(err)
		c.JSON(400, gin.H{"error": "bad request"})
		return
	}

	workout := workout.Workout{Sets: []workout.Set{}}
	err = db.Pool.QuerySingle(c, `
		WITH
			inserted := (INSERT Set_ {
				exercise := (SELECT Exercise FILTER .id = <uuid>$1 LIMIT 1),
				weight := <float32>$2,
				reps := <int16>$3,
			}),
			updated := (
				UPDATE Workout
				FILTER .id = <uuid>$0
				SET { sets += inserted }
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
		}`,
		&workout,
		payload.Workout.ID,
		payload.Exercise.ID,
		payload.Weight,
		payload.Reps,
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	c.JSON(201, gin.H{"data": workout})
}
