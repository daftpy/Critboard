package querySubmissions

import (
	"context"
	"critboard-backend/database/common"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func CreateLink(ctx context.Context,
	db *pgxpool.Pool,
	title string,
	description string,
	submissionType common.SubmissionType,
	link string,
	user common.User,
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
			INSERT INTO submissions (title, description, type, commentable_id, author) 
			VALUES ($1, $2, $3, $4, $5)
			RETURNING commentable_id, created_at, updated_at
		`, title, description, submissionType, commentableID, user.ID).Scan(&commentableID, &createdAt, &updatedAt)
	if err != nil {
		return common.Submission{}, err
	}

	// Then create the link submission
	_, err = db.Exec(ctx, `
			INSERT INTO link_submissions (id, link)
			VALUES ($1, $2)
		`, commentableID, link)
	if err != nil {
		return common.Submission{}, err
	}
	return common.Submission{
		CommentID:   commentableID,
		Title:       title,
		Description: description,
		Type:        submissionType,
		Author:      user,
		LinkDetail:  &common.LinkSubmission{Link: link},
		CreatedAt:   createdAt,
		UpdatedAt:   updatedAt,
	}, nil
}
