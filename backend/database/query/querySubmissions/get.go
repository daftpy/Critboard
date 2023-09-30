package querySubmissions

import (
	"context"
	"critboard-backend/database/common"
	"critboard-backend/database/query/queryUsers"
	"database/sql"
	"github.com/jackc/pgx/v5/pgxpool"
)

type OptionalUploadData struct {
	UploadID sql.NullString
	FilePath sql.NullString
	FileName sql.NullString
	FileExt  sql.NullString
}

func GetByID(ctx context.Context, db *pgxpool.Pool, submissionID string) (common.Submission, error) {
	var submission common.Submission
	var link sql.NullString
	var upload OptionalUploadData
	var userID int
	var user common.User

	err := db.QueryRow(ctx, `
        SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, s.author,
               l.link,
               u.id, u.file_path, u.file_name, u.file_extension
               
        FROM submissions s
        LEFT JOIN link_submissions l ON s.commentable_id = l.id
        LEFT JOIN file_submissions f ON s.commentable_id = f.id
        LEFT JOIN file_uploads u ON f.data = u.id
        WHERE s.commentable_id = $1
    `, submissionID).Scan(
		&submission.CommentID,
		&submission.Title,
		&submission.Description,
		&submission.Type,
		&submission.CreatedAt,
		&submission.UpdatedAt,
		&userID,
		&link,
		&upload.UploadID,
		&upload.FilePath,
		&upload.FileName,
		&upload.FileExt,
	)

	println("USER ID USER ID:", userID)

	if err != nil {
		return common.Submission{}, err
	}

	user, err = queryUsers.GetUserByID(ctx, db, userID)

	submission.Author = user

	if err != nil {
		return common.Submission{}, err
	}

	// Set the link or file details.
	if submission.Type == common.LINK && link.Valid {
		submission.LinkDetail = &common.LinkSubmission{Link: link.String}
	} else if submission.Type == common.FILE && upload.UploadID.Valid && upload.FilePath.Valid && upload.FileName.Valid && upload.FileExt.Valid {
		submission.FileDetail = &common.UploadData{
			UploadID: upload.UploadID.String,
			FilePath: upload.FilePath.String,
			FileName: upload.FileName.String,
			FileExt:  upload.FileExt.String,
		}
	}

	return submission, nil
}

func GetRecentSubmissions(ctx context.Context, db *pgxpool.Pool, count int) ([]common.Submission, error) {
	var submissions []common.Submission

	query := `
		SELECT s.commentable_id, s.title, s.description, s.type, s.created_at, s.updated_at, 
		       l.link,
		       u.id,
		       u.file_path,
		       u.file_name,
		       u.file_extension,
		       COUNT(fb.commentable_id) AS feedback_count
		FROM submissions s
		LEFT JOIN link_submissions l ON s.commentable_id = l.id
		LEFT JOIN file_submissions f ON s.commentable_id = f.id
		LEFT JOIN file_uploads u ON f.data = u.id
		LEFT JOIN feedback fb ON s.commentable_id = fb.parent_commentable_id
		GROUP BY s.commentable_id,s.created_at, l.link, u.id
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
		var link sql.NullString
		var uploadData OptionalUploadData
		err := rows.Scan(
			&submission.CommentID,
			&submission.Title,
			&submission.Description,
			&submission.Type,
			&submission.CreatedAt,
			&submission.UpdatedAt,
			&link,
			&uploadData.UploadID,
			&uploadData.FilePath,
			&uploadData.FileName,
			&uploadData.FileExt,
			&submission.FeedbackCount,
		)
		if err != nil {
			return nil, err
		}

		// Set the link or file details.
		if submission.Type == common.LINK && link.Valid {
			submission.LinkDetail = &common.LinkSubmission{Link: link.String}
		} else if submission.Type == common.FILE {
			submission.FileDetail = &common.UploadData{
				UploadID: uploadData.UploadID.String,
				FilePath: uploadData.FilePath.String,
				FileName: uploadData.FileName.String,
				FileExt:  uploadData.FileExt.String,
			}
		}

		submissions = append(submissions, submission)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return submissions, nil
}
