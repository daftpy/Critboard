import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styles from "../styles/preview/SubmissionPreview.module.css";
import { Link } from "react-router-dom";
import { SubmissionPreviewData } from "../types/submissionTypes.ts";

type PreviewProps = {
  submission: SubmissionPreviewData;
};

export function SubmissionPreview({ submission }: PreviewProps) {
  return (
    <div className={styles.preview}>
      <div className={styles.previewContent}>
        <div className={styles.header}>
          <div>
            <h3>
              <Link
                className={styles.link}
                to={`/submission/${submission.commentId}/`}
              >
                {submission.title}
              </Link>
            </h3>
            <div className={styles.meta}>
              <div className={styles.author}>{submission.author.username}</div>
              <div>
                {formatDistanceToNow(new Date(submission.createdAt), {
                  addSuffix: true,
                })}
              </div>
              {submission.type == "FILE" ? (
                <span className={`material-symbols-outlined`}>stock_media</span>
              ) : (
                <span className={`material-symbols-outlined ${styles.tilted}`}>
                  link
                </span>
              )}
            </div>
          </div>
        </div>
        <p className={styles.description}>{submission.description}</p>
      </div>
      <div className={styles.previewMeta}>
        <div>
          <span className="material-symbols-outlined">comment</span>
          {submission.replyCount}
        </div>
      </div>
    </div>
  );
}
