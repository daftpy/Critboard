package queryFeedback

import (
	"context"
	"critboard-backend/database/common"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Delete(
	ctx context.Context,
	db *pgxpool.Pool,
	commentID string,
) (common.Feedback, error) {
	var feedback common.Feedback

	// Soft delete
	err := db.QueryRow(ctx, `
		UPDATE feedback
		SET deleted = TRUE
		WHERE commentable_id = $1
		RETURNING commentable_id, created_at
	`, commentID).Scan(
		&feedback.CommentID, &feedback.CreatedAt,
	)

	if err != nil {
		return common.Feedback{}, err
	}

	feedback.FeedbackText = "removed"

	return feedback, nil
}
