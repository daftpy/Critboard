import { FeedbackData } from "./feedbackTypes.ts";

type GetFeedbackSuccessResponse = {
  type: "success";
  feedback: FeedbackData[];
};

type GetFeedbackErrorResponse = {
  type: "error";
  errors: string[];
};

export type GetFeedbackResponse =
  | GetFeedbackSuccessResponse
  | GetFeedbackErrorResponse;
