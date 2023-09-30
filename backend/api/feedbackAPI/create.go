package feedbackAPI

import (
	"critboard-backend/api/responsesAPI"
	"critboard-backend/database"
	"critboard-backend/database/common"
	"critboard-backend/database/query/queryFeedback"
	"critboard-backend/database/query/queryUsers"
	"encoding/json"
	"github.com/alexedwards/scs/v2"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Create(db *pgxpool.Pool, sessionManager *scs.SessionManager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload common.FeedbackPayload
		var errors []string
		var twitchID = sessionManager.GetString(r.Context(), "userID")

		user, err := queryUsers.GetUserByTwitchID(r.Context(), db, twitchID)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		log.Println("Received a request")

		// Decode payload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			errors = append(errors, "Invalid request payload")
			log.Println("Error decoding payload:", err)
		}

		// Check valid parent commentable ID
		isValid, err := database.CommentIDisValid(r.Context(), db, payload.CommentID)
		if err != nil {
			log.Println(err)
			return
		}

		if !isValid {
			errors = append(errors, "Invalid parent ID")
		}

		if len(payload.FeedbackText) < 7 {
			errors = append(errors, "Feedback too short")
		}

		// Add the feedback
		feedback, err := queryFeedback.Create(r.Context(), db, payload.CommentID, payload.FeedbackText, user.ID)
		if err != nil {
			errors = append(errors, "Error adding feedback")
			log.Println("Error adding submission:", err)
		} else {
			response := responsesAPI.FeedbackPostResponse{
				Feedback: feedback,
				Message:  "Succesfully created",
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			if err := json.NewEncoder(w).Encode(response); err != nil {
				errors = append(errors, "Failed to encode response")
				log.Println("Failed to encode response:", err)
			}
		}

		if len(errors) > 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			if err := json.NewEncoder(w).Encode(map[string]interface{}{"errors": errors}); err != nil {
				log.Println("Failed to encode error response:", err)
			}
		}
	}
}
