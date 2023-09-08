package queryFeedback

import (
	"context"
	"critboard-backend/database/common"

	"github.com/jackc/pgx/v5/pgxpool"
)

func GetByParentID(ctx context.Context, db *pgxpool.Pool, parentID string) ([]*common.Feedback, error) {
	var feedbacks []*common.Feedback

	rows, err := db.Query(ctx, `
        SELECT f1.commentable_id, f1.feedback_text, f1.created_at, COUNT(f2.commentable_id) as reply_count
        FROM feedback f1
        LEFT JOIN feedback f2 ON f1.commentable_id = f2.parent_commentable_id
        WHERE f1.parent_commentable_id = $1
        GROUP BY f1.commentable_id, f1.feedback_text    
    `, parentID)

	if err != nil {
		return nil, err
	}

	defer rows.Close()

	for rows.Next() {
		var feedback common.Feedback
		var reply_count int

		if err := rows.Scan(&feedback.CommentID, &feedback.FeedbackText, &feedback.CreatedAt, &reply_count); err != nil {
			return nil, err
		}

		feedback.Replies = reply_count
		feedbacks = append(feedbacks, &feedback)
	}

	return feedbacks, nil
}
