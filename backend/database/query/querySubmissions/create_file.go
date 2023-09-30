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
	uploadData common.UploadData,
	userID int,
) (common.Submission, error) {
	var commentableID string
	var createdAt, updatedAt time.Time
	println("TRYING UPLOAD_ID_AND_NAME:", uploadData.UploadID, uploadData.FileName)

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
		`, title, description, submissionType, commentableID, userID).Scan(&commentableID, &createdAt, &updatedAt)
	if err != nil {
		return common.Submission{}, err
	}

	println("TRYING UPLOAD_ID:", uploadData.UploadID)
	// Then create the file submission
	_, err = db.Exec(ctx, `
			INSERT INTO file_submissions (id, data)
			VALUES ($1, $2)
		`, commentableID, uploadData.UploadID)
	if err != nil {
		return common.Submission{}, err
	}
	return common.Submission{
		CommentID:   commentableID,
		Title:       title,
		Description: description,
		Type:        submissionType,
		Author:      userID,
		FileDetail: &common.UploadData{
			UploadID: uploadData.UploadID,
			FilePath: uploadData.FilePath,
			FileName: uploadData.FileName,
			FileExt:  uploadData.FileExt,
		},
		CreatedAt: createdAt,
		UpdatedAt: updatedAt,
	}, nil
}
