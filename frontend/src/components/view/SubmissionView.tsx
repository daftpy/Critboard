import Template from "./Template";
import styles from "../../styles/components/view/SubmissionView.module.css";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getSubmission } from "../../features/submission/services/getSubmission.ts";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import FeedbackList from "../../features/feedback/components/FeedbackList.tsx";
import FeedbackForm from "../../features/feedback/components/FeedbackForm.tsx";
import { useFeedbackData } from "../../features/feedback/hooks/useFeedbackData.ts";

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

  const approvedExt = [".jpeg", ".jpg", ".png", ".gif"];

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
              {submissionData.fileDetail ? (
                approvedExt.includes(
                  submissionData.fileDetail.file_extension,
                ) ? (
                  <div className={styles.imageContainer}>
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_URL}/uploads/${
                        submissionData.fileDetail.file_name
                      }${submissionData.fileDetail.file_extension}`}
                      alt={submissionData.fileDetail.file_name}
                      className={styles.submissionImage}
                    />
                  </div>
                ) : (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={submissionData.link}
                    className={styles.submissionLink}
                  >
                    {submissionData.fileDetail.file_name}
                  </a>
                )
              ) : (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={submissionData.link}
                  className={styles.submissionLink}
                >
                  {submissionData.linkDetail && submissionData.linkDetail.link}
                </a>
              )}
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
                handleUpdateFeedback={updateFeedbackData}
                handleIncrementReply={incrementReplyCount}
              />
            </div>
          </div>
        </>
      ) : null}
    </Template>
  );
}
