package auth

import (
	"fmt"
	"github.com/bradfitz/gomemcache/memcache"
	"github.com/pkg/errors"
	"time"
)

func StoreOAuthTokens(mc *memcache.Client, userID, accessToken, refreshToken string, expiry time.Time) error {
	// Convert the expiration time
	expirationStr := expiry.Format(time.RFC3339)

	err := mc.Set(&memcache.Item{
		Key:   "access_token:" + userID,
		Value: []byte(accessToken),
	})
	if err != nil {
		return err
	}

	err = mc.Set(&memcache.Item{
		Key:   "refresh_token:" + userID,
		Value: []byte(refreshToken),
	})
	if err != nil {
		return err
	}

	err = mc.Set(&memcache.Item{
		Key:   "access_token_expiration:" + userID,
		Value: []byte(expirationStr),
	})

	return err
}

func IsTokenExpired(mc *memcache.Client, userID string) (bool, error) {
	expirationItem, err := mc.Get("access_token_expiration:" + userID)

	if errors.Is(err, memcache.ErrCacheMiss) {
		// If the userID cannot be found
		return false, fmt.Errorf("cache miss for userID %s: %w", userID, err)
	} else if err != nil {
		return false, fmt.Errorf("failed to get expiration time: %w", err)
	}

	// Parse the expiration time
	expirationTime, err := time.Parse(time.RFC3339, string(expirationItem.Value))
	if err != nil {
		return false, fmt.Errorf("failed to parse expiration time: %w", err)
	}

	return time.Now().After(expirationTime), nil
}

func GetOAuthTokens(mc *memcache.Client, userID string) (string, string, error) {
	expired, err := IsTokenExpired(mc, userID)

	if err != nil {
		return "", "", fmt.Errorf("error checking token expiration: %w", err)
	}

	if expired {
		// Handle refresh
	}

	accessTokenItem, err := mc.Get("access_token:" + userID)
	if err != nil {
		return "", "", err
	}

	refreshTokenItem, err := mc.Get("refresh_token:" + userID)
	if err != nil {
		return "", "", err
	}

	return string(accessTokenItem.Value), string(refreshTokenItem.Value), nil
}
