package critMiddleware

import (
	"github.com/alexedwards/scs/v2"
	"log"
	"net/http"
)

func AuthMiddleware(sessionManager *scs.SessionManager) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			session := sessionManager.Get(r.Context(), "userID")
			log.Printf("Session value: %v\n", session)
			if session == nil {
				// Not authenticated
				http.Error(w, "Forbidden", http.StatusForbidden)
				return
			}
			// Call the next handler if authenticated
			next.ServeHTTP(w, r)
		})
	}
}
