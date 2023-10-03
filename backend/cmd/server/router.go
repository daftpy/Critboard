package main

import (
	"critboard-backend/api/authAPI"
	"critboard-backend/api/feedbackAPI"
	"critboard-backend/api/submissionsAPI"
	"critboard-backend/api/uploadAPI"
	"critboard-backend/api/usersAPI"
	"critboard-backend/pkg/critMiddleware"
	"github.com/alexedwards/scs/v2"
	"github.com/bradfitz/gomemcache/memcache"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/rs/cors"
)

func InitializeRouter(db *pgxpool.Pool, mc *memcache.Client, sessionManager *scs.SessionManager, encryptionKey []byte) *chi.Mux {
	r := chi.NewRouter()

	serverDomain := os.Getenv("SERVER_DOMAIN")

	// Middleware
	r.Use(middleware.Logger)
	r.Use(sessionManager.LoadAndSave)
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{serverDomain},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "PATCH"},
		Debug:            true,
	}).Handler)

	authHandler := authAPI.NewAuthHandler(db, mc, sessionManager, encryptionKey)
	authMiddleware := critMiddleware.AuthMiddleware(sessionManager)

	// Routes
	r.Post("/uploads", uploadAPI.UploadFile(db))
	r.With(authMiddleware).Post("/submissions/link/create", submissionsAPI.CreateLink(db, sessionManager))
	r.With(authMiddleware).Post("/submissions/file/create", submissionsAPI.CreateFile(db, sessionManager))
	r.Get("/submissions/recent/{count}", submissionsAPI.GetRecent(db))
	r.Get("/submissions/{id}", submissionsAPI.Get(db))
	r.Get("/submissions/{id}/feedback", feedbackAPI.Get(db))
	r.With(authMiddleware).Post("/submissions/{id}/feedback", feedbackAPI.Create(db, sessionManager))

	r.Patch("/feedback/{id}", feedbackAPI.Update(db))
	r.Patch("/feedback/{id}/remove", feedbackAPI.Remove(db))
	r.Get("/feedback/{id}/replies", feedbackAPI.Get(db))
	r.With(authMiddleware).Post("/feedback/{id}/replies", feedbackAPI.Create(db, sessionManager))

	r.Get("/users", usersAPI.Get(db, sessionManager))

	r.Get("/auth/twitch", authHandler.TwitchAuthHandler())
	r.Get("/oauth/callback", authHandler.TwitchCallbackHandler())
	return r
}
