package main

import (
	"critboard-backend/api/feedbackAPI"
	"critboard-backend/api/submissionsAPI"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
)

func InitializeRouter(db *pgxpool.Pool) *chi.Mux {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	}).Handler)

	// Routes
	r.Post("/submissions/", submissionsAPI.Create(db))
	r.Get("/submissions/id/{id}", submissionsAPI.Get(db))
	r.Get("/feedback/{parentID}", feedbackAPI.Get(db))
	r.Post("/submissions/{id}", feedbackAPI.Create(db))

	return r
}
