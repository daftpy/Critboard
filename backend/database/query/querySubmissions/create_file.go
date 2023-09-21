package querySubmissions

import (
	"context"
	"critboard-backend/database/common"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateFile(ctx context.Context,
	db *pgxpool.Pool,
	title string,
	description string,
	submissionType common.SubmissionType,
	file string,
) (common.Submission, error) {
	var commentableID string
	var createdAt, updatedAt time.Time

	// Create the commentable entry
	err := db.QueryRow(ctx, `
			INSERT INTO commentables DEFAULT VALUES 
			RETURNING id
		`).Scan(&commentableID)
	if err != nil {
		return common.Submission{}, err
	}

	// Create the submission
	err = db.QueryRow(ctx, `
			INSERT INTO submissions (title, description, type, commentable_id) 
			VALUES ($1, $2, $3, $4)
			RETURNING commentable_id, created_at, updated_at
		`, title, description, submissionType, commentableID).Scan(&commentableID, &createdAt, &updatedAt)
	if err != nil {
		return common.Submission{}, err
	}

	// Then create the link submission
	_, err = db.Exec(ctx, `
			INSERT INTO file_submissions (id, file_path)
			VALUES ($1, $2)
		`, commentableID, file)
	if err != nil {
		return common.Submission{}, err
	}
	return common.Submission{
		CommentID:   commentableID,
		Title:       title,
		Description: description,
		Type:        submissionType,
		FileDetail:  &common.FileSubmission{File: file},
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}, nil
}
