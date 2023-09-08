package database

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

func InitializeDB(ctx context.Context) *pgxpool.Pool {
	dsn := "postgres://postgres:changeme@db:5432/critboard_db?sslmode=disable"

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("Failed to initialize database pool: %v", err)
	}

	return pool
}

func TestConn(ctx context.Context, db *pgxpool.Pool) {
	var ping int
	err := db.QueryRow(ctx, "SELECT 1").Scan(&ping)
	if err != nil {
		panic(err)
	}
	if ping != 1 {
		panic("Expected ping to return 1")
	}
	log.Println("Database connection succesful.")
}

func CommentIDisValid(ctx context.Context, db *pgxpool.Pool, commentID string) (bool, error) {
	var exists bool
	err := db.QueryRow(
		ctx, "SELECT exists(SELECT 1 FROM commentables WHERE id=$1)", commentID,
	).Scan(&exists)
	return exists, err
}
