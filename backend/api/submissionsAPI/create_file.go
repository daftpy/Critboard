package submissionsAPI

import (
	"critboard-backend/api/responsesAPI"
	"critboard-backend/database/common"
	"critboard-backend/database/query/querySubmissions"
	"encoding/json"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"net/http"
)

func CreateFile(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload common.SubmissionPayload
		var errors []string

		log.Println("Received a request")

		//Decode the payload and determine the submission type
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			errors = append(errors, "Invalid request payload")
			log.Println("Error decoding payload", err)
		}

		// Validate title and description
		if len(payload.Title) < 5 {
			errors = append(errors, "Title too short")
		}

		if len(payload.Description) < 16 {
			errors = append(errors, "Description too short")
		}

		// Validate upload entry exists
		/////////////////////////////////
		println("PAYLOAD_DATA_LOOK_HERE:", payload.UploadData.UploadID, payload.UploadData.FileExt)

		if len(errors) == 0 {
			submission, err := querySubmissions.CreateFile(
				r.Context(), db, payload.Title, payload.Description, payload.Type, payload.UploadData,
			)
			if err != nil {
				errors = append(errors, "Error adding submission")
				log.Println("Error adding submission:", err)
			} else {
				response := responsesAPI.SubmissionPostResponse{
					Submission: submission,
					Message:    "Succesfully created",
				}

				// Send the response
				w.Header().Set("Coontent-Type", "application/json")
				w.WriteHeader(http.StatusCreated)
				if err := json.NewEncoder(w).Encode(response); err != nil {
					errors = append(errors, "Failed to encode response")
					log.Println("Failed to encode response:", err)
				}
			}
		} else {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			if err := json.NewEncoder(w).Encode(map[string]interface{}{"errors": errors}); err != nil {
				log.Println("Failed to encode error response:", err)
			}
		}
	}
}
