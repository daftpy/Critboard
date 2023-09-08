import Feedback, { IFeedback } from "./Feedback";
import styles from "../../styles/components/feedback/FeedbackList.module.css"

interface IFeedbackListProps {
  feedbacks?: IFeedback[];
}

export default function FeedbackList({ feedbacks }: IFeedbackListProps) {
  return (
    <>
      {feedbacks && feedbacks.length > 0 ? (
        <ul className={styles.feedbackList}>
          {feedbacks.map((feedback: IFeedback) => (
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
