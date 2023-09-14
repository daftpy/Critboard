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
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		Debug:            true,
	}).Handler)

	// Routes
	r.Post("/submissions/", submissionsAPI.Create(db))
	r.Get("/submissions/recent/{count}", submissionsAPI.GetRecent(db))
	r.Get("/submissions/{id}", submissionsAPI.Get(db))
	r.Get("/submissions/{id}/feedback", feedbackAPI.Get(db))
	r.Post("/submissions/{id}/feedback", feedbackAPI.Create(db))

	r.Patch("/feedback/{id}", feedbackAPI.Update(db))
	r.Get("/feedback/{id}/replies", feedbackAPI.Get(db))
	r.Post("/feedback/{id}/replies", feedbackAPI.Create(db))
	return r
}
