package queryUsers

import (
	"context"
	"critboard-backend/database/common"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

func CreateUser(db *pgxpool.Pool, twitchID string, username string, email string) (*common.UserData, error) {
	var result common.UserData

	err := db.QueryRow(
		context.Background(),
		`
        INSERT INTO users (twitch_id, username, email)
        VALUES ($1, $2, $3)
        RETURNING id, twitch_id, username, email, created_at, updated_at
        `,
		twitchID, username, email,
	).Scan(
		&result.UserID,
		&result.TwitchID,
		&result.Username,
		&result.Email,
		&result.CreatedAt,
		&result.UpdatedAt,
	)

	if err != nil {
		return nil, errors.Wrap(err, "failed to insert user into DB")
	}

	return &result, nil
}
