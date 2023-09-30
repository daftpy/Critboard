export type FeedbackData = {
  feedbackText: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
  commentId: string;
  removed: boolean;
  author: User;
};

export type User = {
  id: number;
  twitchId: number;
  username: string;
  email: string;
};

export type FeedbackFormData = {
  feedbackText: string;
  commentId: string;
};

export type ActionType = "POST" | "UPDATE" | "DELETE";
