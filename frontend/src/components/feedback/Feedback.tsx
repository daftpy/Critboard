import styles from "../../styles/components/feedback/Feedback.module.css"
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
  }

type Props = {
  feedback: FeedbackData;
  updateFeedback: (updatedFeedback: FeedbackData) => void;
}

export default function Feedback({ feedback, updateFeedback }: Props) {

  const {
    showReplies,
    showForm,
    editMode,
    feedbackData,
    addFeedback,
    updateFeedbackData,
    getMetaProps,
  } = useFeedback(feedback);

  return (
    <li className={styles.feedback}>

        {/* Feedback and Edit Form */}
        <div className={`${styles.edit} ${styles.collapsable} ${editMode ? styles.show : null}`}>
          <FeedbackForm
            commentId={feedback.commentId}
            onSubmit={updateFeedback}
            replyForm={false}
            text={feedback.feedbackText}
            buttonText="Save Edit"
            actionType="UPDATE"
          />
        </div>

        <div className={`${styles.collapsable} ${editMode ? null : styles.show}`}>
          <p className={styles.feedbackText}>{feedback.feedbackText}</p>
        </div>

      {/* Feedback meta */}
      <FeedbackMeta {...getMetaProps()} />

      {/* Reply Form */}
      <div className={`${styles.collapsable} ${showForm ? styles.show : null}`}>
        <FeedbackForm
          commentId={feedback.commentId}
          onSubmit={addFeedback}
          replyForm={true}
        />
      </div>

      {/* Replies */}
      <div className={`${styles.collapsable} ${showReplies ? styles.show : null}`}>
          <FeedbackList feedbacks={feedbackData} updateFeedback={updateFeedbackData} />
      </div>

    </li>
  )
}
