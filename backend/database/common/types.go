package common

import "time"

type SubmissionType string

const (
	LINK SubmissionType = "LINK"
	FILE SubmissionType = "FILE"
)

type Submission struct {
	CommentID     string          `json:"commentId"`
	Title         string          `json:"title"`
	Description   string          `json:"description"`
	Type          SubmissionType  `json:"type"`
	Author        int             `json:"author"`
	LinkDetail    *LinkSubmission `json:"linkDetail,omitempty"`
	FileDetail    *UploadData     `json:"fileDetail,omitempty"`
	CreatedAt     time.Time       `json:"createdAt"`
	UpdatedAt     time.Time       `json:"updatedAt"`
	FeedbackCount *int            `json:"feedbackCount,omitempty"`
}

type LinkSubmission struct {
	Link string `json:"link"`
}

type UploadData struct {
	FileName string `json:"file_name"`
	FilePath string `json:"file_path"`
	FileExt  string `json:"file_extension"`
	UploadID string `json:"id"`
}

type SubmissionPayload struct {
	Title       string         `json:"title"`
	Description string         `json:"description"`
	Type        SubmissionType `json:"type"`
	Link        string         `json:"link,omitempty"`
	UploadData  UploadData     `json:"upload_data,omitempty"`
}

type Feedback struct {
	CommentID    string    `json:"commentId"`
	FeedbackText string    `json:"feedbackText"`
	CreatedAt    time.Time `json:"createdAt"`
	Replies      int       `json:"replies"`
	Removed      bool      `json:"removed"`
	Author       int       `json:"author"`
}

type User struct {
	ID       int    `json:"id"`
	TwitchID string `json:"twitchId"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

type FeedbackPayload struct {
	CommentID    string `json:"commentId"`
	FeedbackText string `json:"feedbackText"`
}

type SubmissionsResponse struct {
	Submissions []Submission `json:"submissions"`
}

type UserData struct {
	UserID    int       `json:"userId"`
	TwitchID  string    `json:"twitchId"`
	Username  string    `json:"username"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}
