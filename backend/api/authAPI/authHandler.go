package authAPI

import (
	"fmt"
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
	encryptionKey  []byte
}

func NewAuthHandler(db *pgxpool.Pool, mc *memcache.Client, sessionManager *scs.SessionManager, encryptionKey []byte) *AuthHandler {
	// Set the callback url using the env variable.
	serverDomain := os.Getenv("SERVER_DOMAIN")
	redirectURL := fmt.Sprintf("%s/api/oauth/callback", serverDomain)

	return &AuthHandler{
		db: db,
		oauthConfig: &oauth2.Config{
			ClientID:     os.Getenv("TWITCH_CLIENT_ID"),
			ClientSecret: os.Getenv("TWITCH_CLIENT_SECRET"),
			RedirectURL:  redirectURL,
			Scopes:       []string{"user:read:email"},
			Endpoint:     twitch.Endpoint,
		},
		httpClient:     &http.Client{},
		memcacheClient: mc,
		sessionManager: sessionManager,
		encryptionKey:  encryptionKey,
	}
}
