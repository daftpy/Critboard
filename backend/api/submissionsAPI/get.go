package submissionsAPI

import (
	"critboard-backend/api/responsesAPI"
	"critboard-backend/database/query/queryFeedback"
	"critboard-backend/database/query/querySubmissions"
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Get(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		submissionID := chi.URLParam(r, "id")

		// Get the submission
		submission, err := querySubmissions.GetByID(r.Context(), db, submissionID)
		if err != nil {
			if err == pgx.ErrNoRows {
				w.WriteHeader(http.StatusNotFound)
				json.NewEncoder(w).Encode(map[string]string{"error": "submission not found"})
				return
			}
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		// Get the feedback for the submission
		feedbacks, err := queryFeedback.GetByParentID(r.Context(), db, submission.CommentID)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		response := responsesAPI.SubmissionGetResponse{
			Submission: submission,
			Feedback:   feedbacks,
		}
		if err := json.NewEncoder(w).Encode(response); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
