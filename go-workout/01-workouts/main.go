package main

import (
	"github.com/edgedb/edgedb-examples/go-workout/internal/workout"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.POST("/api/workout", workout.Create)
	r.GET("/api/workout", workout.ReadMany)
	r.GET("/api/workout/:id", workout.Read)

	r.Run()
}
