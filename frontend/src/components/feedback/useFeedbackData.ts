import { IFeedback } from "./Feedback"
import { useState } from "react";

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<IFeedback[]>([]);

  const addFeedbackData = (newFeedback: IFeedback | IFeedback[]) => {
    console.log("adding to state")
    if (Array.isArray(newFeedback)) {
      setFeedbackData([...feedbackData, ...newFeedback]);
    } else {
      setFeedbackData([...feedbackData, newFeedback]);
    }
  }

  const updateFeedbackData = (updatedFeedback: IFeedback) => {
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