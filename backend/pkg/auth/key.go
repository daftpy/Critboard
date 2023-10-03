package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"fmt"
	"golang.org/x/crypto/pbkdf2"
	"io"
	"os"
	"strconv"
	"time"
)

func DeriveKey(passphrase string, salt []byte, iterations int, keyLen int) []byte {
	return pbkdf2.Key([]byte(passphrase), salt, iterations, keyLen, sha256.New)
}

func DeriveSeed() string {
	return strconv.Itoa(os.Getpid()) + strconv.FormatInt(time.Now().UnixNano(), 10)
}

func GenerateSalt() ([]byte, error) {
	salt := make([]byte, 16)

	_, err := io.ReadFull(rand.Reader, salt)
	if err != nil {
		return nil, fmt.Errorf("error generating salt: %v", err)
	}

	return salt, nil
}
