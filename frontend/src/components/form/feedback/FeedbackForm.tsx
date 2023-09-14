import { useFeedbackForm } from "./useFeedbackForm";
import { IFormData } from "../../../services/feedback/createFeedback";
import styles from "../../../styles/components/form/feedback/FeedbackForm.module.css"
import Button from "../../ui/Button";
import { IFeedback } from "../../feedback/Feedback";
import { useEffect } from "react";

interface IFeedbackFormProps {
  commentId: string;
  text?: string;
  addFeedback: (feedback: IFeedback) => void;
  replyForm?: boolean;
  buttonText?: string;
}

export default function FeedbackForm({ commentId, text, addFeedback, replyForm, buttonText }: IFeedbackFormProps) {
  const initialData: IFormData = {
    feedbackText: text || "",
    commentId: commentId
  }

  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit
  } = useFeedbackForm(initialData, addFeedback, replyForm);


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