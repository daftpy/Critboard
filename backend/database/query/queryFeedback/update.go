package queryFeedback

import (
	"context"
	"critboard-backend/database/common"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Update(
	ctx context.Context,
	db *pgxpool.Pool,
	commentID string,
	newFeedbackText string,
) (common.Feedback, error) {
	var feedback common.Feedback

	// Update the feedback entry by its commentable ID
	err := db.QueryRow(ctx, `
		UPDATE feedback
		SET feedback_text = $1
		WHERE commentable_id = $2
		RETURNING commentable_id, feedback_text, created_at
	`, newFeedbackText, commentID).Scan(
		&feedback.CommentID, &feedback.FeedbackText, &feedback.CreatedAt,
	)

	if err != nil {
		return common.Feedback{}, err
	}

	return feedback, nil
}
