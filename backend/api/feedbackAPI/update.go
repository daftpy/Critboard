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

func Update(db *pgxpool.Pool, sessionManager *scs.SessionManager) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload common.FeedbackPayload
		var errors []string

		log.Println("Received an update request")

		// Get the userID
		var twitchID = sessionManager.GetString(r.Context(), "userID")
		user, err := queryUsers.GetUserByTwitchID(r.Context(), db, twitchID)

		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		// Decode payload
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			errors = append(errors, "Invalid request payload")
			log.Println("Error decoding payload:", err)
		}

		// Check valid commentable ID
		isValid, err := database.CommentIDisValid(r.Context(), db, payload.CommentID)
		if err != nil {
			log.Println(err)
			return
		}

		if !isValid {
			errors = append(errors, "Invalid comment ID")
		}

		if len(payload.FeedbackText) < 7 {
			errors = append(errors, "Feedback too short")
		}

		// Update the feedback
		feedback, err := queryFeedback.Update(r.Context(), db, payload.CommentID, payload.FeedbackText, user)
		if err != nil {
			errors = append(errors, "Error updating feedback")
			log.Println("Error updating feedback:", err)
		} else {
			response := responsesAPI.FeedbackPostResponse{
				Feedback: feedback,
				Message:  "Successfully updated",
			}

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusOK)
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
