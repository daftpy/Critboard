package authAPI

import (
	"github.com/alexedwards/scs/v2"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/twitch"
	"net/http"
	"os"
)

type AuthHandler struct {
	db             *pgxpool.Pool
	oauthConfig    *oauth2.Config
	httpClient     *http.Client
	memcacheClient *memcache.Client
	sessionManager *scs.SessionManager
}

func NewAuthHandler(db *pgxpool.Pool, mc *memcache.Client, sessionManager *scs.SessionManager) *AuthHandler {
	return &AuthHandler{
		db: db,
		oauthConfig: &oauth2.Config{
			ClientID:     os.Getenv("TWITCH_CLIENT_ID"),
			ClientSecret: os.Getenv("TWITCH_CLIENT_SECRET"),
			RedirectURL:  "http://localhost:8080/api/oauth/callback",
			Scopes:       []string{"user:read:email"},
			Endpoint:     twitch.Endpoint,
		},
		httpClient:     &http.Client{},
		memcacheClient: mc,
		sessionManager: sessionManager,
	}
}
