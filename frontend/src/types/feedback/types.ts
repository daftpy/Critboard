export type FeedbackData = {
  feedbackText: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
  commentId: string;
  removed: boolean;
};

export type ActionType = "POST" | "UPDATE" | "DELETE";
