package auth

import "github.com/bradfitz/gomemcache/memcache"

func StoreOAuthTokens(mc *memcache.Client, userID, accessToken, refreshToken string) error {
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
	return err
}

func GetOAuthTokens(mc *memcache.Client, userID string) (string, string, error) {
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
