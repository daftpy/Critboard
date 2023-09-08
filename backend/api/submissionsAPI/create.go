package submissionsAPI

import (
	"critboard-backend/api/responsesAPI"
	"critboard-backend/database/common"
	"critboard-backend/database/query/querySubmissions"
	"encoding/json"
	"log"
	"net/http"
	"net/url"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Create(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload common.SubmissionPayload
		var errors []string

		log.Println("Received a request")

		//Decode the payload and determine the submission type
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			errors = append(errors, "Invalid request payload")
			log.Println("Error decoding payload", err)
		}

		switch payload.Type {
		case "LINK":

			if len(payload.Title) < 5 {
				errors = append(errors, "Title too short")
			}

			if len(payload.Description) < 16 {
				errors = append(errors, "Description too short")
			}

			// Attempt to validate the link
			_, err := url.ParseRequestURI(payload.Link)
			if err != nil {
				errors = append(errors, "Error parsing link")
			}

			// After validating the payload, attempt to create the submission
			if len(errors) == 0 {
				submission, err := querySubmissions.CreateLink(
					r.Context(), db, payload.Title, payload.Description, payload.Type, payload.Link,
				)

				if err != nil {
					errors = append(errors, "Error adding submission")
					log.Println("Error adding submission: ", err)
				} else {
					response := responsesAPI.SubmissionPostResponse{
						Submission: submission,
						Message:    "Succesfully created",
					}

					// Send the response
					w.Header().Set("Content-Type", "application/json")
					w.WriteHeader(http.StatusCreated)
					if err := json.NewEncoder(w).Encode(response); err != nil {
						errors = append(errors, "Failed to encode response")
						log.Println("Failed to encode response:", err)
					}
				}
			}
		default:
			errors = append(errors, "Invalid submission type")
		}

		// If errors, send them in the response
		if len(errors) > 0 {
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusBadRequest)
			if err := json.NewEncoder(w).Encode(map[string]interface{}{"errors": errors}); err != nil {
				log.Println("Failed to encode error response:", err)
			}
		}
	}
}
