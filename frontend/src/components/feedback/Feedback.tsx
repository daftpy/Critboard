import styles from "../../styles/components/feedback/Feedback.module.css"
import FeedbackForm from "../form/feedback/FeedbackForm";
import { useFeedback } from "./useFeedback";
import FeedbackList from "./FeedbackList";
import { useState } from "react";
import FeedbackMeta from "./FeedbackMeta";

export interface IFeedback {
    feedbackText: string;
    createdAt: string;
    updatedAt: string;
    replies: number;
    commentId: string;
  }

interface IProps {
  feedback: IFeedback;
}

export default function Feedback({ feedback }: IProps) {
  const [feedbackText, setText] = useState<string>(feedback.feedbackText);

  const {
    showReplies,
    showForm,
    editMode,
    feedbackData,
    addFeedback,
    getMetaProps,
  } = useFeedback(feedback);

  return (
    <li className={styles.feedback}>

        {/* Feedback and Edit Form */}
        <div className={`${styles.edit} ${styles.collapsable} ${editMode ? styles.show : null}`}>
          <FeedbackForm
            commentId={feedback.commentId}
            addFeedback={addFeedback}
            replyForm={false}
            text={feedbackText}
            buttonText="Save Edit"
            actionType="UPDATE"
            updateText={setText}
          />
        </div>

        <div className={`${styles.collapsable} ${editMode ? null : styles.show}`}>
          <p className={styles.feedbackText}>{feedbackText}</p>
        </div>

      {/* Feedback meta */}
      <FeedbackMeta {...getMetaProps()} />

      {/* Reply Form */}
      <div className={`${styles.collapsable} ${showForm ? styles.show : null}`}>
        <FeedbackForm
          commentId={feedback.commentId}
          addFeedback={addFeedback}
          replyForm={true}
        />
      </div>

      {/* Replies */}
      <div className={`${styles.collapsable} ${showReplies ? styles.show : null}`}>
          <FeedbackList feedbacks={feedbackData} />
      </div>

    </li>
  )
}
