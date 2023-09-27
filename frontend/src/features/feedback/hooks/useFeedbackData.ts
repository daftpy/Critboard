/**
 * `useFeedbackData` is a hook for managing feedback data state, including individual feedback items
 * and collections of feedback items. This hook provides functions for adding new feedback,
 * updating existing feedback, and incrementing reply count for a particular feedback.
 *
 * This hook is versatile and can be used at both the submission level to manage parent feedback data
 * and at the individual feedback level to manage replies.
 *
 * The state is managed using React's `useState` hook and exposes an object containing:
 * - `feedbackData`: An array of `FeedbackData` objects representing the current state of feedback data.
 * - `setFeedbackData`: A function to directly set the `feedbackData` state (use with caution).
 * - `addFeedbackData`: A function to add new feedback data to the existing state.
 * - `updateFeedbackData`: A function to update a specific feedback item in the existing state.
 * - `incrementReplyCount`: A function to increment the reply count of a specific feedback item.
 */

import { FeedbackData } from "../types/feedbackTypes.ts";
import { useState } from "react";

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);

  const addFeedbackData = (newFeedback: FeedbackData | FeedbackData[]) => {
    if (Array.isArray(newFeedback)) {
      setFeedbackData([...feedbackData, ...newFeedback]);
    } else {
      setFeedbackData([...feedbackData, newFeedback]);
    }
  };

  const updateFeedbackData = (updatedFeedback: FeedbackData) => {
    setFeedbackData((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.commentId === updatedFeedback.commentId
          ? { ...feedback, ...updatedFeedback, replies: feedback.replies }
          : feedback,
      ),
    );
  };

  const incrementReplyCount = (commentId: string) => {
    setFeedbackData((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.commentId === commentId
          ? { ...feedback, replies: feedback.replies + 1 }
          : feedback,
      ),
    );
  };

  return {
    feedbackData,
    setFeedbackData,
    addFeedbackData,
    updateFeedbackData,
    incrementReplyCount,
  };
}
