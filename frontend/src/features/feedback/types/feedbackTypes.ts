export type FeedbackData = {
  feedbackText: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
  commentId: string;
  removed: boolean;
};

export type FeedbackFormData = {
  feedbackText: string;
  commentId: string;
};

export type ActionType = "POST" | "UPDATE" | "DELETE";
