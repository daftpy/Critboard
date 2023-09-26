import { useFeedbackManager } from "../hooks/useFeedbackManager.ts";
import { FeedbackData } from "../../../types/feedback/types.ts";
import FeedbackForm from "./FeedbackForm.tsx";
import FeedbackMeta from "./FeedbackMeta.tsx";
import FeedbackList from "./FeedbackList.tsx";
import styles from "../styles/Feedback.module.css";

type Props = {
  feedback: FeedbackData;
  handleUpdateFeedback: (updateFeedback: FeedbackData) => void;
  handleIncrementReply: (commentId: string) => void;
};

export default function Feedback({
  feedback,
  handleUpdateFeedback,
  handleIncrementReply,
}: Props) {
  const {
    showReplies,
    showForm,
    editMode,
    feedbackData,
    handleAddFeedback,
    childUpdateFeedbackData,
    childHandleIncrementReply,
    getMetaProps,
    getEditFormProps,
  } = useFeedbackManager(feedback, handleUpdateFeedback, handleIncrementReply);

  return (
    <li className={styles.feedback}>
      <div
        className={`${styles.edit} ${styles.collapsable} ${
          editMode && styles.show
        }`}
      >
        <FeedbackForm {...getEditFormProps()} />
      </div>

      <div className={`${styles.collapsable} ${!editMode && styles.show}`}>
        <p className={styles.feedbackText}>{feedback.feedbackText}</p>
      </div>

      <div>
        <FeedbackMeta {...getMetaProps()} />
      </div>

      <div className={`${styles.collapsable} ${showForm && styles.show}`}>
        <FeedbackForm
          commentId={feedback.commentId}
          onSubmit={handleAddFeedback}
        />
      </div>

      <div className={`${styles.collapsable} ${showReplies && styles.show}`}>
        <FeedbackList
          feedbacks={feedbackData}
          handleUpdateFeedback={childUpdateFeedbackData}
          handleIncrementReply={childHandleIncrementReply}
        />
      </div>
    </li>
  );
}
