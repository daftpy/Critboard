import formatDistanceToNow from "date-fns/formatDistanceToNow";
import styles from "../../styles/components/submission/SubmissionPreview.module.css"
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
      <h3><Link to={`/submission/${submission.commentId}/`}>{ submission.title }</Link></h3>
      <div className={styles.meta}>
        <div>Author</div>
        <div>{formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}</div>
      </div>
      <p className={styles.description}>{ submission.description }</p>
    </div>
  )
}