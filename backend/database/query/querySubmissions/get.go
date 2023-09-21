package querySubmissions

import (
	"context"
	"critboard-backend/database/common"
	"database/sql"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetByID(ctx context.Context, db *pgxpool.Pool, submissionID string) (common.Submission, error) {
	var submission common.Submission
	var link, file sql.NullString

	err := db.QueryRow(ctx, `
        SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, l.link, f.file_path
        FROM submissions s
        LEFT JOIN link_submissions l ON s.commentable_id = l.id
        LEFT JOIN file_submissions f ON s.commentable_id = f.id
        WHERE s.commentable_id = $1
    `, submissionID).Scan(
		&submission.CommentID,
		&submission.Title,
		&submission.Description,
		&submission.Type,
		&submission.CreatedAt,
		&submission.UpdatedAt,
		&link,
		&file,
	)

	if err != nil {
		return common.Submission{}, err
	}

	// Set the link or file details.
	if submission.Type == common.LINK && link.Valid {
		submission.LinkDetail = &common.LinkSubmission{Link: link.String}
	} else if submission.Type == common.FILE && file.Valid {
		submission.FileDetail = &common.FileSubmission{File: file.String}
	}

	return submission, nil
}

func GetRecentSubmissions(ctx context.Context, db *pgxpool.Pool, count int) ([]common.Submission, error) {
	var submissions []common.Submission

	query := `
		SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, 
		       l.link, f.file_path, COUNT(fb.commentable_id) AS feedback_count
		FROM submissions s
		LEFT JOIN link_submissions l ON s.commentable_id = l.id
		LEFT JOIN file_submissions f ON s.commentable_id = f.id
		LEFT JOIN feedback fb ON s.commentable_id = fb.parent_commentable_id
		GROUP BY s.commentable_id, l.link, f.file_path
		ORDER BY s.created_at DESC
		LIMIT $1
    `

	rows, err := db.Query(ctx, query, count)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var submission common.Submission
		var link, file sql.NullString
		err := rows.Scan(
			&submission.CommentID,
			&submission.Title,
			&submission.Description,
			&submission.Type,
			&submission.CreatedAt,
			&submission.UpdatedAt,
			&link,
			&file,
			&submission.FeedbackCount,
		)
		if err != nil {
			return nil, err
		}

		// Set the link or file details.
		if submission.Type == common.LINK && link.Valid {
			submission.LinkDetail = &common.LinkSubmission{Link: link.String}
		} else if submission.Type == common.FILE && file.Valid {
			submission.FileDetail = &common.FileSubmission{File: file.String}
		}

		submissions = append(submissions, submission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return submissions, nil
}
