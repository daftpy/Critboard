package queryUsers

import (
	"context"
	"critboard-backend/database/common"
	"github.com/jackc/pgx/v5/pgxpool"
)

func GetUserByTwitchID(ctx context.Context, db *pgxpool.Pool, twitchID string) (common.User, error) {
	var user common.User

	err := db.QueryRow(ctx, `
        SELECT id, twitch_id, username, email
        FROM users
        WHERE twitch_id = $1
    `, twitchID).Scan(
		&user.ID,
		&user.TwitchID,
		&user.Username,
		&user.Email,
	)

	if err != nil {
		return common.User{}, err
	}

	return user, nil
}
