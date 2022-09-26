package db

import (
	"context"
	"log"

	"github.com/edgedb/edgedb-go"
)

var Pool = connect()

func connect() *edgedb.Client {
	ctx := context.Background()
	pool, err := edgedb.CreateClient(ctx, edgedb.Options{})
	if err != nil {
		log.Fatal(err)
	}

	return pool
}
