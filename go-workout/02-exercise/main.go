package main

import (
	"github.com/edgedb/edgedb-examples/go-workout/internal/exercise"
	"github.com/edgedb/edgedb-examples/go-workout/internal/workout"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/api/workout", workout.Create)
	r.GET("/api/workout", workout.ReadMany)
	r.GET("/api/workout/:id", workout.Read)

	r.POST("/api/exercise", exercise.Create)
	r.GET("/api/exercise", exercise.ReadMany)
	r.PUT("/api/exercise", exercise.Update)

	r.Run()
}
