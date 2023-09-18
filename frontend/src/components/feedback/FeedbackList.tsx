import Feedback, { FeedbackData } from "./Feedback";
import styles from "../../styles/components/feedback/FeedbackList.module.css"
import { compareDesc, parseISO } from "date-fns";

interface IFeedbackListProps {
  feedbacks?: FeedbackData[];
  updateFeedback: (updatedFeedback: FeedbackData) => void;
  incrementReply: (commentId: string) => void;
}

export default function FeedbackList({ feedbacks, updateFeedback, incrementReply }: IFeedbackListProps) {
  const sortedFeedbacks = feedbacks ? [...feedbacks].sort((a, b) => {
    return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
  }) : [];

  return (
    <>
      {feedbacks && feedbacks.length > 0 ? (
        <ul className={styles.feedbackList}>
          {sortedFeedbacks.map((feedback: FeedbackData) => (
            <Feedback key={feedback.commentId} feedback={feedback} updateFeedback={updateFeedback} incrementReply={incrementReply} />
          ))}
        </ul>
      ) : (
        <p className={styles.callToAction} style={{textAlign: "center", marginTop: "3.5em", fontSize: "24px", fontWeight: 300}}>
          There is no feedback yet. Let them know what you think.
        </p>
      )}
    </>
  );
}
