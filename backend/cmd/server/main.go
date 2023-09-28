package main

import (
	"context"
	"critboard-backend/database"
	"critboard-backend/migrations"
	"github.com/alexedwards/scs/v2"
	"github.com/bradfitz/gomemcache/memcache"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi"
)

func main() {
	ctx := context.Background()

	sessionManager := scs.New()
	sessionManager.Lifetime = 24 * time.Hour

	router := initializeServer(ctx, sessionManager)

	http.ListenAndServe(":3000", router)
	log.Println("Server status: Running")
}

func initializeServer(ctx context.Context, sessionManager *scs.SessionManager) *chi.Mux {
	db := database.InitializeDB(ctx)
	database.TestConn(ctx, db)

	mc := memcache.New("memcached:11211")

	migrations.RunInitialMigrations(ctx, db)

	r := InitializeRouter(db, mc, sessionManager)

	return r
}
