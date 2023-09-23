package queryFileUpload

import (
	"context"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

type Result struct {
	ID       string
	FilePath string
}

func CreateFileUpload(db *pgxpool.Pool, filePath string) (*Result, error) {
	var result Result

	// Insert file_path into the file_uploads table and return the UUID
	err := db.QueryRow(context.Background(), `
		INSERT INTO file_uploads (file_path)
		VALUES ($1)
		RETURNING id, file_path
	`, filePath).Scan(&result.ID, &result.FilePath)

	if err != nil {
		return nil, errors.Wrap(err, "failed to insert file upload into DB")
	}
	return &result, nil
}
