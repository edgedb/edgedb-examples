package main

import (
	"github.com/edgedb/workout-tutorial/internal/exercise"
	"github.com/edgedb/workout-tutorial/internal/set"
	"github.com/edgedb/workout-tutorial/internal/workout"
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

	r.POST("/api/set", set.Create)

	r.Run()
}
