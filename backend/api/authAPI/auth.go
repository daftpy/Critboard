package authAPI

import (
	"critboard-backend/database/query/queryUsers"
	"encoding/json"
	"golang.org/x/oauth2"
	"log"
	"net/http"
)

func (a *AuthHandler) TwitchAuthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		url := a.oauthConfig.AuthCodeURL("state", oauth2.AccessTypeOnline)
		http.Redirect(w, r, url, http.StatusTemporaryRedirect)
	}
}

func (a *AuthHandler) TwitchCallbackHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Println("URL:", r.URL.String())         // Log the URL
		log.Println("Query Params:", r.URL.Query()) // Log the query parameters
		token, err := a.oauthConfig.Exchange(oauth2.NoContext, r.URL.Query().Get("code"))
		if err != nil {
			log.Println("Error exchanging code for token:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		client := &http.Client{}
		req, err := http.NewRequest("GET", "https://api.twitch.tv/helix/users", nil)
		if err != nil {
			log.Println("Error creating request object:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		req.Header.Set("Authorization", "Bearer "+token.AccessToken)
		req.Header.Set("Client-Id", a.oauthConfig.ClientID)
		res, err := client.Do(req)
		if err != nil {
			log.Println("Error fetching user info:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		defer res.Body.Close()

		var userInfo struct {
			Data []struct {
				ID    string `json:"id"`
				Login string `json:"login"`
				Email string `json:"email"`
			} `json:"data"`
		}

		if err := json.NewDecoder(res.Body).Decode(&userInfo); err != nil {
			log.Println("Error decoding user info:", err)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		if len(userInfo.Data) == 0 {
			log.Println("No user data received")
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		userData, err := queryUsers.CreateUser(a.db, userInfo.Data[0].ID, userInfo.Data[0].Login, userInfo.Data[0].Email)
		if err != nil {
			log.Println("Error creating user:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		println(userData)

		// Create a user session, store it in the database, and send a session ID to the client
		// ...

		response := map[string]interface{}{
			"message": "Successfully authenticated",
			// ... other response data
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Println("Failed to encode response:", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		}
	}
}
