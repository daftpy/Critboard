import styles from "../../styles/components/feedback/Feedback.module.css"
import FeedbackForm from "../form/feedback/FeedbackForm";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { useFeedback } from "./useFeedback";
import FeedbackList from "./FeedbackList";
import ReplyButton from "./ReplyButton";

export interface IFeedback {
    feedbackText: string;
    createdAt: string;
    updatedAt: string;
    replies: number;
    commentId: string;
  }

interface IFeedbackProps {
  feedback: IFeedback;
}
  
export default function Feedback({ feedback }: IFeedbackProps) {

  const {
    showReplies,
    showForm,
    feedbackData,
    toggleForm,
    toggleReplies,
    addFeedbackData
  } = useFeedback(feedback);

  return (
    <li className={styles.feedback}>

      <p>{feedback.feedbackText}</p>

      <div className={styles.meta}>
        <div className={styles.innerMeta}>
          <div className={styles.author}>Author</div>
          <div className={styles.createdAt}>
            {formatDistanceToNow(new Date(feedback.createdAt), { addSuffix: true })}
          </div>
        </div>

        <ReplyButton
          toggleForm={toggleForm}
          replyCount={feedback.replies}
          showForm={showForm}
          toggleReplies={() => toggleReplies(feedback.commentId)}
          showReplies={showReplies}
        />
      </div>

      <div className={`${styles.replyForm} ${showForm ? styles.show : null}`}>
        <FeedbackForm commentId={feedback.commentId} addFeedback={addFeedbackData} replyForm={true} />
      </div>

      <div className={`${styles.replies} ${showReplies ? styles.show : null}`}>
        <div style={{overflow: "hidden"}}>
          <FeedbackList feedbacks={feedbackData} />
        </div>
      </div>

    </li>
  )
}
