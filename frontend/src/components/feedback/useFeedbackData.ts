import { IFeedback } from "./Feedback"
import { useState } from "react";

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<IFeedback[]>([]);

  const addFeedbackData = (newFeedback: IFeedback | IFeedback[]) => {
    if (Array.isArray(newFeedback)) {
      setFeedbackData([...feedbackData, ...newFeedback]);
    } else {
      setFeedbackData([...feedbackData, newFeedback]);
    }
  }

  const updateFeedbackData = (updatedFeedback: IFeedback) => {
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