import { IFeedback } from "./Feedback"
import { useState } from "react";

export function useFeedbackData() {
  const [feedbackData, setFeedbackData] = useState<IFeedback[]>([]);

  const addFeedbackData = (newFeedback: IFeedback) => {
    setFeedbackData([...feedbackData, newFeedback]);
  }

  return {
    feedbackData,
    setFeedbackData,
    addFeedbackData
  }
}