package main

import (
	"context"
	"critboard-backend/database"
	"critboard-backend/migrations"
	"critboard-backend/pkg/auth"
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
	sessionManager.Cookie.Persist = true
	sessionManager.Cookie.SameSite = http.SameSiteNoneMode
	sessionManager.Cookie.Secure = false

	router, err := initializeServer(ctx, sessionManager)
	if err != nil {
		return
	}

	http.ListenAndServe(":3000", router)
	log.Println("Server status: Running")
}

func initializeServer(ctx context.Context, sessionManager *scs.SessionManager) (*chi.Mux, error) {
	db := database.InitializeDB(ctx)
	database.TestConn(ctx, db)

	mc := memcache.New("memcached:11211")

	migrations.RunInitialMigrations(ctx, db)

	key, err := generateKey()

	if err != nil {
		return nil, err
	}

	r := InitializeRouter(db, mc, sessionManager, key)

	return r, nil
}

func generateKey() ([]byte, error) {
	salt, err := auth.GenerateSalt()

	if err != nil {
		log.Println("Error generating salt:", err)
		return nil, err
	}

	var seed = auth.DeriveSeed()

	iterations := 4096
	keyLen := 32

	key := auth.DeriveKey(seed, salt, iterations, keyLen)

	return key, nil
}
