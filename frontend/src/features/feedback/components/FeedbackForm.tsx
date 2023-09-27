import { useFeedbackForm } from "../hooks/useFeedbackForm.ts";
import { FeedbackFormData } from "../types/feedbackTypes.ts";
import styles from "../styles/FeedbackForm.module.css";
import Button from "../../../components/ui/Button.tsx";
import { FeedbackData } from "../types/feedbackTypes.ts";
import { useEffect } from "react";
import { ActionType } from "../types/feedbackTypes.ts";

type FeedbackFormProps = {
  commentId: string;
  text?: string;
  onSubmit: (feedback: FeedbackData) => void;
  replyForm?: boolean;
  buttonText?: string;
  actionType?: ActionType;
};

export default function FeedbackForm({
  commentId,
  text,
  onSubmit,
  replyForm,
  buttonText,
  actionType = "POST",
}: FeedbackFormProps) {
  const initialData: FeedbackFormData = {
    feedbackText: text || "",
    commentId: commentId,
  };

  const { formData, setFormData, handleChange, handleSubmit } = useFeedbackForm(
    { initialData, onSubmit, replyForm, actionType },
  );

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      feedbackText: text || "",
    }));
  }, [text]);

  return (
    <form
      style={{ overflow: "hidden" }}
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
  );
}
