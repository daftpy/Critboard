package queryFileUpload

import (
	"context"
	"critboard-backend/database/common"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

func CreateFileUpload(db *pgxpool.Pool, filePath string, fileName string, fileExt string) (*common.UploadData, error) {
	var result common.UploadData

	// Insert file_path into the file_uploads table and return the UUID
	err := db.QueryRow(context.Background(), `
		INSERT INTO file_uploads (file_path, file_name, file_extension)
		VALUES ($1, $2, $3)
		RETURNING id, file_path, file_name, file_extension
	`, filePath, fileName, fileExt).Scan(
		&result.UploadID,
		&result.FilePath,
		&result.FileName,
		&result.FileExt,
	)

	if err != nil {
		return nil, errors.Wrap(err, "failed to insert file upload into DB")
	}
	return &result, nil
}
