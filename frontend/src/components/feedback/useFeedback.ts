import { useState } from "react";
import { getFeedback } from "../../services/feedback/getFeedback";
import { IFeedback } from "./Feedback";
import { useFeedbackData } from "./useFeedbackData";

export function useFeedback(feedback: IFeedback) {
  const [showReplies, setShowReplies] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const {
    feedbackData,
    setFeedbackData,
  } = useFeedbackData();

  const toggleForm = () => {
    setShowForm(!showForm);
  }

  const toggleReplies = (id: string) => {
    async function fetchReplies(id: string) {
      const result = await getFeedback(id);

      if (result.type === "success") {
        console.log(result);
        setFeedbackData(result.feedback || []);
      } else {
        console.error(result.errors);
      }
    }

    if (showReplies) {
      setShowReplies(false);
    } else {
      fetchReplies(id).then(() => {
        setShowReplies(true);
        if (feedback.replies === 0) {
          setShowForm(true);
        }
      })
    }
  }

  const addFeedbackData = (newFeedback: IFeedback) => {
    feedback.replies += 1;
    setFeedbackData([...feedbackData, newFeedback]);
  }

  return {
    showReplies,
    showForm,
    feedbackData,
    toggleForm,
    toggleReplies,
    addFeedbackData
  }
}