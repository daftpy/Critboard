package main

import (
	"context"
	"critboard-backend/database"
	"critboard-backend/migrations"
	"log"
	"net/http"

	"github.com/go-chi/chi"
)

func main() {
	ctx := context.Background()

	router := initializeServer(ctx)

	http.ListenAndServe(":3000", router)
	log.Println("Server status: Running")
}

func initializeServer(ctx context.Context) *chi.Mux {
	db := database.InitializeDB(ctx)
	database.TestConn(ctx, db)

	migrations.RunInitialMigrations(ctx, db)

	r := InitializeRouter(db)

	return r
}
