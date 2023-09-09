package querySubmissions

import (
	"context"
	"critboard-backend/database/common"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetByID(ctx context.Context, db *pgxpool.Pool, submissionID string) (common.Submission, error) {
	var submission common.Submission

	err := db.QueryRow(ctx, `
        SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, l.link
        FROM submissions s
        LEFT JOIN link_submissions l ON s.commentable_id = l.id
        WHERE s.commentable_id = $1
    `, submissionID).Scan(&submission.CommentID, &submission.Title, &submission.Description, &submission.Type, &submission.CreatedAt, &submission.UpdatedAt, &submission.Link)

	if err != nil {
		return common.Submission{}, err
	}

	return submission, nil
}

func GetRecentSubmissions(ctx context.Context, db *pgxpool.Pool, count int) ([]common.Submission, error) {
	// Create a slice to store the submissions
	var submissions []common.Submission

	// Write the SQL query
	query := `
		SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, l.link, COUNT(f.commentable_id) AS feedback_count
		FROM submissions s
		LEFT JOIN link_submissions l ON s.commentable_id = l.id
		LEFT JOIN feedback f ON s.commentable_id = f.parent_commentable_id
		GROUP BY s.commentable_id, l.link
		ORDER BY s.created_at DESC
		LIMIT $1	
    `

	// Execute the query
	rows, err := db.Query(ctx, query, count)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate through the rows
	for rows.Next() {
		var submission common.Submission
		err := rows.Scan(&submission.CommentID, &submission.Title, &submission.Description, &submission.Type, &submission.CreatedAt, &submission.UpdatedAt, &submission.Link, &submission.FeedbackCount)
		if err != nil {
			return nil, err
		}

		// Append each submission to the slice
		submissions = append(submissions, submission)
	}

	// Check for errors from iterating over rows.
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return submissions, nil
}
