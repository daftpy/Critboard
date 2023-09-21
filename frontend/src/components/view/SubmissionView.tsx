import Template from "./Template";
import styles from "../../styles/components/view/SubmissionView.module.css";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubmission } from "../../services/submission/getSubmission.ts";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import FeedbackList from "../feedback/FeedbackList";
import FeedbackForm from "../form/feedback/FeedbackForm";
import { useFeedbackData } from "../feedback/useFeedbackData";

export default function SubmissionView() {
  const location = useLocation();
  const { commentId } = useParams();

  const [submissionData, setSubmissionData] = useState(
    location.state?.submissionData,
  );
  const {
    feedbackData,
    addFeedbackData,
    updateFeedbackData,
    incrementReplyCount,
  } = useFeedbackData();

  useEffect(() => {
    if (!submissionData) {
      console.log("No submission data. Using commentId", commentId);

      getSubmission(commentId as string).then((result) => {
        console.log(result);
        setSubmissionData(result.submission);
        if (result.feedback) {
          console.log("adding feeedbacks");
          addFeedbackData(result.feedback);
        }
      });
    }
  }, []);

  return (
    <Template>
      {submissionData ? (
        <>
          <div className={styles.submission}>
            <div className={styles.submissionHeader}>
              <h1 className={styles.title}>{submissionData.title}</h1>
              <div className={styles.submissionMeta}>
                <div className={styles.author}>Author</div>
                <div className={styles.created}>
                  Submitted{" "}
                  {formatDistanceToNow(new Date(submissionData.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
            <div className={styles.link}>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={submissionData.link}
                className={styles.submissionLink}
              >
                {submissionData.linkDetail.link}
              </a>
            </div>
            <div className={styles.description}>
              <h4>Description</h4>
              <p>{submissionData.description}</p>
              <hr className={styles.divider} />
            </div>
          </div>
          <div className={styles.feedbackContainer}>
            <h2 style={{ fontSize: "28px", marginBottom: "0.5em" }}>
              Feedback
            </h2>
            <FeedbackForm
              commentId={submissionData.commentId}
              onSubmit={addFeedbackData}
            />
            <div style={{ marginTop: "2.5em" }}>
              <FeedbackList
                feedbacks={feedbackData}
                updateFeedback={updateFeedbackData}
                incrementReply={incrementReplyCount}
              />
            </div>
          </div>
        </>
      ) : null}
    </Template>
  );
}
