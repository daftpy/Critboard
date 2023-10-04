package queryFeedback

import (
	"context"
	"critboard-backend/database/common"
	"fmt"
	"github.com/jackc/pgx/v5"
	"github.com/pkg/errors"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Update(
	ctx context.Context,
	db *pgxpool.Pool,
	commentID string,
	newFeedbackText string,
	user common.User,
) (common.Feedback, error) {
	var feedback common.Feedback

	// Update the feedback entry by its commentable ID
	err := db.QueryRow(ctx, `
		UPDATE feedback
		SET feedback_text = $1
		WHERE commentable_id = $2 AND author = $3
		RETURNING commentable_id, feedback_text, created_at
	`, newFeedbackText, commentID, user.ID).Scan(
		&feedback.CommentID, &feedback.FeedbackText, &feedback.CreatedAt,
	)

	// If the userID and feedback author do not match
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return common.Feedback{}, fmt.Errorf(
				"%w: no feedback found for commentID: %s and userID: %s",
				"feedback not found",
				commentID,
				user.ID,
			)
		}
		return common.Feedback{}, fmt.Errorf(
			"failed to update feedback: %w",
			err,
		)
	}

	return feedback, nil
}
