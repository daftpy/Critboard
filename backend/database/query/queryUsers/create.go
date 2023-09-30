package queryUsers

import (
	"context"
	"critboard-backend/database/common"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
)

func CreateUser(db *pgxpool.Pool, twitchID string, username string, email string) (*common.User, error) {
	var result common.User

	err := db.QueryRow(
		context.Background(),
		`
        INSERT INTO users (twitch_id, username, email)
        VALUES ($1, $2, $3)
        RETURNING id, twitch_id, username, email
        `,
		twitchID, username, email,
	).Scan(
		&result.ID,
		&result.TwitchID,
		&result.Username,
		&result.Email,
	)

	if err != nil {
		return nil, errors.Wrap(err, "failed to insert user into DB")
	}

	return &result, nil
}
