package feedbackAPI

import (
	"critboard-backend/api/responsesAPI"
	"critboard-backend/database"
	"critboard-backend/database/common"
	"critboard-backend/database/query/queryFeedback"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Remove(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload common.FeedbackPayload
		var errors []string

		log.Println("Received a removal request")

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

		// Soft delete the feedback
		feedback, err := queryFeedback.Delete(r.Context(), db, payload.CommentID)
		if err != nil {
			errors = append(errors, "Error removing feedback")
			log.Println("Error removing feedback:", err)
		} else {
			response := responsesAPI.FeedbackPostResponse{
				Feedback: feedback,
				Message:  "Successfully removed",
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
