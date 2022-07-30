package exercise

import (
	"encoding/json"
	"log"

	"github.com/edgedb/edgedb-go"
	"github.com/edgedb/workout-tutorial/internal/db"
	"github.com/gin-gonic/gin"
)

type Exercise struct {
	ID   edgedb.UUID `edgedb:"id" json:"id"`
	Name string      `edgedb:"name" json:"name"`
}

// Create inserts a new exercise and returns the full list of exercises.
func Create(c *gin.Context) {
	var payload Exercise
	err := json.NewDecoder(c.Request.Body).Decode(&payload)
	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	result := []Exercise{}
	err = db.Pool.Query(c, `
		WITH
			inserted := (INSERT Exercise { name := <str>$0 }),
			all := (inserted UNION (SELECT Exercise)),
		SELECT DISTINCT (all { name })
		ORDER BY .name ASC`,
		&result,
		payload.Name,
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	c.JSON(201, gin.H{"data": result})
}

// ReadMany returns the full list of exercises.
func ReadMany(c *gin.Context) {
	results := []Exercise{}
	err := db.Pool.Query(c, `
		SELECT Exercise { id, name }
		ORDER BY .name ASC`,
		&results,
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	c.JSON(200, gin.H{"data": results})
}

// Update changes and exercise name and returns the full list of exercises.
func Update(c *gin.Context) {
	var payload Exercise
	err := json.NewDecoder(c.Request.Body).Decode(&payload)
	if err != nil {
		log.Println(err)
		c.JSON(400, gin.H{"error": "bad request"})
		return
	}

	result := []Exercise{}
	err = db.Pool.Query(c, `
		WITH
			updated := (
				UPDATE Exercise
				FILTER .id = <uuid>$0
				SET { name := <str>$1 }
			),
			all := (updated UNION (SELECT Exercise)),
		SELECT DISTINCT all { id, name }
		ORDER BY .name ASC`,
		&result,
		payload.ID,
		payload.Name,
	)

	if err != nil {
		log.Println(err)
		c.JSON(500, gin.H{"error": "server error"})
		return
	}

	c.JSON(200, gin.H{"data": result})
}
