package responsesAPI

import "critboard-backend/database/common"

type SubmissionPostResponse struct {
	Submission common.Submission `json:"submission"`
	Message    string            `json:"message"`
}

type SubmissionGetResponse struct {
	Submission common.Submission  `json:"submission"`
	Feedback   []*common.Feedback `json:"feedback,omitempty"`
}

type FeedbackGetResponse struct {
	Feedback []*common.Feedback `json:"feedback,omitempty"`
}

type FeedbackPostResponse struct {
	Feedback common.Feedback `json:"feedback"`
	Message  string          `json:"message"`
}
