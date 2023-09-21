import styles from "../../styles/components/feedback/Feedback.module.css";
import FeedbackForm from "../form/feedback/FeedbackForm";
import { useFeedback } from "./useFeedback";
import FeedbackList from "./FeedbackList";
import FeedbackMeta from "./FeedbackMeta";

export type FeedbackData = {
  feedbackText: string;
  createdAt: string;
  updatedAt: string;
  replies: number;
  commentId: string;
  removed: boolean;
};

type Props = {
  feedback: FeedbackData;
  updateFeedback: (updatedFeedback: FeedbackData) => void;
  incrementReply: (commentId: string) => void;
};

export default function Feedback({
  feedback,
  updateFeedback,
  incrementReply,
}: Props) {
  const {
    showReplies,
    showForm,
    editMode,
    feedbackData,
    addFeedback,
    updateFeedbackData,
    incrementReplyCount,
    getMetaProps,
    getEditFormProps,
  } = useFeedback(feedback, updateFeedback, incrementReply);

  return (
    <li className={styles.feedback}>
      {/* Feedback and Edit Form */}
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

      {/* Feedback meta */}
      <FeedbackMeta {...getMetaProps()} />

      {/* Reply Form */}
      <div className={`${styles.collapsable} ${showForm && styles.show}`}>
        <FeedbackForm
          commentId={feedback.commentId}
          onSubmit={addFeedback}
          replyForm={true}
        />
      </div>

      {/* Replies */}
      <div className={`${styles.collapsable} ${showReplies && styles.show}`}>
        <FeedbackList
          feedbacks={feedbackData}
          updateFeedback={updateFeedbackData}
          incrementReply={incrementReplyCount}
        />
      </div>
    </li>
  );
}
