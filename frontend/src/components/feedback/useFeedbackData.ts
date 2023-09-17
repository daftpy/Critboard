import { FeedbackData } from "./Feedback"
import { useState } from "react";

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);

  const addFeedbackData = (newFeedback: FeedbackData | FeedbackData[]) => {
    console.log("adding to state")
    if (Array.isArray(newFeedback)) {
      setFeedbackData([...feedbackData, ...newFeedback]);
    } else {
      setFeedbackData([...feedbackData, newFeedback]);
    }
  }

  const updateFeedbackData = (updatedFeedback: FeedbackData) => {
    console.log("updating state");
    setFeedbackData(prevFeedbacks =>
      prevFeedbacks.map(feedback => 
        feedback.commentId === updatedFeedback.commentId ? updatedFeedback : feedback
      )
    );
  }

  return {
    feedbackData,
    setFeedbackData,
    addFeedbackData,
    updateFeedbackData
  }
}