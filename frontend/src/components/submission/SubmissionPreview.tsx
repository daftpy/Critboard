import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styles from "../../styles/components/submission/SubmissionPreview.module.css";
import { Link } from "react-router-dom";

export interface IPreview {
  commentId: string;
  title: string;
  description: string;
  type: "LINK" | "FILE";
  createdAt: string;
  updatedAt: string;
  replyCount?: number;
}

interface IPreviewProps {
  submission: IPreview;
}

export function SubmissionPreview({ submission }: IPreviewProps) {
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
              <div className={styles.author}>Author</div>
              <div>
                {formatDistanceToNow(new Date(submission.createdAt), {
                  addSuffix: true,
                })}
              </div>
              <div className={styles.fileType}>
                {submission.type == "FILE" ? (
                  <>
                    File
                    <span className={`material-symbols-outlined`}>
                      stock_media
                    </span>
                  </>
                ) : (
                  <>
                    Link
                    <span
                      className={`material-symbols-outlined ${styles.tilted}`}
                    >
                      link
                    </span>
                  </>
                )}
              </div>
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
