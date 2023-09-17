import { ActionType, useFeedbackForm } from "./useFeedbackForm";
import { IFormData } from "../../../services/feedback/createFeedback";
import styles from "../../../styles/components/form/feedback/FeedbackForm.module.css"
import Button from "../../ui/Button";
import { FeedbackData } from "../../feedback/Feedback";
import { useEffect } from "react";

interface IFeedbackFormProps {
  commentId: string;
  text?: string;
  onSubmit: (feedback: FeedbackData) => void;
  replyForm?: boolean;
  buttonText?: string;
  actionType?: ActionType;
}

export default function FeedbackForm({ commentId, text, onSubmit, replyForm, buttonText, actionType = "POST"}: IFeedbackFormProps) {
  const initialData: IFormData = {
    feedbackText: text || "",
    commentId: commentId
  }

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit
  } = useFeedbackForm({initialData, onSubmit, replyForm, actionType});


  useEffect(() => {
    setFormData(prevData => ({
      ...prevData,
      feedbackText: text || ""
    }));
  }, [text]);

  return (
    <form
      style={{overflow: "hidden"}}
      className={styles.feedbackForm}
      onSubmit={handleSubmit}
    >
      <textarea
        className={`${styles.textArea}`}
        name="feedbackText"
        value={formData.feedbackText}
        onChange={handleChange}
      />
      <Button message={buttonText ? buttonText : "Submit"} />
    </form>
  )
}