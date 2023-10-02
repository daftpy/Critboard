package queryUsers

import (
	"context"
	"critboard-backend/database/common"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"
	"log"
	"strconv"
)

func CreateUser(db *pgxpool.Pool, twitchID string, username string, email string) (*common.User, error) {
	var result common.User

	// Check if user already exists
	var existingID int

	err := db.QueryRow(
		context.Background(),
		"SELECT id FROM users WHERE twitch_id = $1",
		twitchID,
	).Scan(&existingID)

	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			// Create the user
			err = db.QueryRow(
				context.Background(),
				`
				INSERT INTO users (twitch_id, username, email)
				VALUES ($1, $2, $3)
				RETURNING id, twitch_id, username, email
				`,
				twitchID, username, email,
			).Scan(
				// Scan in the user data
				&result.ID,
				&result.TwitchID,
				&result.Username,
				&result.Email,
			)

			if err != nil {
				// User creation error
				return nil, err
			}
		} else {
			// Database error
			return nil, err
		}
	} else {
		// Convert twitchID from string to int
		numTwitchID, err := strconv.Atoi(twitchID)
		if err != nil {
			log.Println("Error converting user ID to int:", err)
			return nil, err
		}
		// User already exists, return the user data
		result.ID = existingID
		result.TwitchID = numTwitchID
		result.Username = username
		result.Email = email
	}
	return &result, nil
}
