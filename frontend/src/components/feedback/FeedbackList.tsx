import Feedback, { IFeedback } from "./Feedback";
import styles from "../../styles/components/feedback/FeedbackList.module.css"
import { compareDesc, parseISO } from "date-fns";

interface IFeedbackListProps {
  feedbacks?: IFeedback[];
}

export default function FeedbackList({ feedbacks }: IFeedbackListProps) {
  const sortedFeedbacks = feedbacks ? [...feedbacks].sort((a, b) => {
    return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
  }) : [];

  return (
    <>
      {feedbacks && feedbacks.length > 0 ? (
        <ul className={styles.feedbackList}>
          {sortedFeedbacks.map((feedback: IFeedback) => (
            <Feedback key={feedback.commentId} feedback={feedback} />
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
