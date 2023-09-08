package migrations

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func RunInitialMigrations(ctx context.Context, db *pgxpool.Pool) {
	scriptBytes, err := os.ReadFile("/migrations/001_initial_setup.sql")
	if err != nil {
		log.Fatalf("Error reading migration file: %v", err)
	}

	requests := string(scriptBytes)
	_, err = db.Exec(ctx, requests)
	if err != nil {
		log.Fatalf("Error executing migrations: %v", err)
	}

	log.Println("Initial migrations applied successfully!")
}
