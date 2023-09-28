package uploadAPI

import (
	"critboard-backend/database/query/queryFileUpload"
	"encoding/json"
	"fmt"
	"github.com/jackc/pgx/v5/pgxpool"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"time"
)

// I SUSPECT THE PATH an app/uploads has something to do with the error
const uploadBasePath = "/app/uploads"  // base path to save uploaded files
const maxUploadSize = 50 * 1024 * 1024 // e.g., 50MB

func UploadFile(db *pgxpool.Pool) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Check if the request method is POST
		if r.Method != "POST" {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		// Check the file size
		if r.ContentLength > maxUploadSize {
			http.Error(w, fmt.Sprintf("Max upload size is %d", maxUploadSize), http.StatusBadRequest)
			return
		}

		// Parse the multipart/form-data
		r.ParseMultipartForm(maxUploadSize)
		file, handler, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "Unable to get file from form", http.StatusBadRequest)
			return
		}
		defer file.Close()

		ext := filepath.Ext(handler.Filename)

		// Generate a filename using current time + random number
		rand.Seed(time.Now().UnixNano())
		originalFilename := fmt.Sprintf("%d_%d", time.Now().Unix(), rand.Intn(1000))
		filenameWithExt := originalFilename + ext
		fullPath := filepath.Join(uploadBasePath, filenameWithExt)

		// TROUBLE SHOOTING
		if _, err := os.Stat(uploadBasePath); os.IsNotExist(err) {
			log.Println("Upload directory does not exist:", uploadBasePath)
			// Optionally, you can also create the directory here
			// os.MkdirAll(uploadBasePath, 0755)
		}

		// Create the file on disk
		out, err := os.Create(fullPath)
		if err != nil {
			log.Println("Error creating file:", err)
			http.Error(w, "Unable to create file on server", http.StatusInternalServerError)
			return
		}
		defer out.Close()

		// Stream the file content to disk
		_, err = io.Copy(out, file)
		if err != nil {
			http.Error(w, "Error occurred while saving file", http.StatusInternalServerError)
			return
		}

		// Insert the file_path into the database and get the UUID.
		fileUpload, err := queryFileUpload.CreateFileUpload(db, uploadBasePath, originalFilename, ext)
		if err != nil {
			http.Error(w, "Error storing file information", http.StatusInternalServerError)
			return
		}

		// Send back the UUID and file path
		w.Header().Set("Content-Type", "application/json")
		response := map[string]string{
			"id":             fileUpload.UploadID,
			"file_path":      fileUpload.FilePath,
			"file_name":      fileUpload.FileName,
			"file_extension": fileUpload.FileExt,
		}
		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Println("Failed to encode response:", err)
			http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		}
	}
}
