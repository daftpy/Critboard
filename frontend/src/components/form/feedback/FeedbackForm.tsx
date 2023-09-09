import { useFeedbackForm } from "./useFeedbackForm";
import { IFormData } from "../../../services/feedback/createFeedback";
import styles from "../../../styles/components/form/feedback/FeedbackForm.module.css"
import Button from "../../ui/Button";
import { IFeedback } from "../../feedback/Feedback";

interface IFeedbackFormProps {
  commentId: string;
  text?: string;
  addFeedback: (feedback: IFeedback) => void;
  
}

export default function FeedbackForm({ commentId, text, addFeedback }: IFeedbackFormProps) {
  const initialData: IFormData = {
    feedbackText: text || "",
    commentId: commentId
  }

  const {
    formData,
    handleChange,
    handleSubmit
  } = useFeedbackForm(initialData, addFeedback);

  return (
    <form style={{overflow: "hidden"}} className={styles.feedbackForm} onSubmit={handleSubmit}>
      <textarea
        className={styles.textArea}
        name="feedbackText"
        value={formData.feedbackText}
        onChange={handleChange}
      />
      <Button message="Submit" />
    </form>
  )
}