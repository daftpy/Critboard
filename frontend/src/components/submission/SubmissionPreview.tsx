import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styles from "../../styles/components/submission/SubmissionPreview.module.css";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

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
          </div>
        </div>
        <p className={styles.description}>{submission.description}</p>
      </div>
      <div className={styles.previewMeta}>
        <Button
          message={`${submission.type.charAt(0).toUpperCase()}${submission.type
            .slice(1)
            .toLowerCase()}`}
          size="small"
        />
        <div>Replies: x</div>
      </div>
    </div>
  );
}
