import styles from "../../styles/components/feedback/Feedback.module.css"
import FeedbackForm from "../form/feedback/FeedbackForm";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFeedback } from "./useFeedback";
import FeedbackList from "./FeedbackList";
import ReplyButton from "./ReplyButton";
import Button from "../ui/Button";
import { useState } from "react";

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
    toggleEditMode,
    toggleForm,
    toggleReplies,
    addFeedbackData
  } = useFeedback(feedback);

  return (
    <li className={styles.feedback}>

        {/* Feedback and Edit Form */}
        <div className={`${styles.edit} ${styles.collapsable} ${editMode ? styles.show : null}`}>
          <FeedbackForm
            commentId={feedback.commentId}
            addFeedback={addFeedbackData}
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
      <div className={styles.meta}>
        <div className={styles.innerMeta}>
          <div className={styles.author}>Author</div>
          <div className={styles.createdAt}>
            {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
          </div>
          <Button
            message={editMode ? "Cancel" : "Edit"}
            onClick={toggleEditMode}
            size="xsmall"
            style={editMode ? {backgroundColor: "#676767", color: '#f0f0f0'} : {}}
          />
        </div>

        <ReplyButton
          toggleForm={toggleForm}
          replyCount={feedback.replies}
          showForm={showForm}
          toggleReplies={() => toggleReplies(feedback.commentId)}
          showReplies={showReplies}
        />
      </div>

      {/* Reply Form */}
      <div className={`${styles.collapsable} ${showForm ? styles.show : null}`}>
        <FeedbackForm
          commentId={feedback.commentId}
          addFeedback={addFeedbackData}
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
