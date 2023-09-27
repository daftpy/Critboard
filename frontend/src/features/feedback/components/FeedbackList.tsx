import { FeedbackData } from "../types/feedbackTypes.ts";
import { compareDesc, parseISO } from "date-fns";
import Feedback from "./Feedback.tsx";
import styles from "../styles/FeedbackList.module.css";

type Props = {
  feedbacks?: FeedbackData[];
  handleUpdateFeedback: (updateFeedback: FeedbackData) => void;
  handleIncrementReply: (commentId: string) => void;
};

export default function FeedbackList({
  feedbacks,
  handleUpdateFeedback,
  handleIncrementReply,
}: Props) {
  const sortedFeedbacks = feedbacks
    ? [...feedbacks].sort((a, b) => {
        return compareDesc(parseISO(a.createdAt), parseISO(b.createdAt));
      })
    : [];

  return (
    <>
      {feedbacks && feedbacks.length > 0 ? (
        <ul className={styles.feedbackList}>
          {sortedFeedbacks.map((feedback: FeedbackData) => (
            <Feedback
              key={feedback.commentId}
              feedback={feedback}
              handleUpdateFeedback={handleUpdateFeedback}
              handleIncrementReply={handleIncrementReply}
            />
          ))}
        </ul>
      ) : (
        <p className={styles.callToAction}>
          There is no feedback yet. Let them know what you think.
        </p>
      )}
    </>
  );
}
