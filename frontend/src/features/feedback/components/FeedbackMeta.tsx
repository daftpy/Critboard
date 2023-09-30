import EditButton, { EditButtonProps } from "./ui/EditButton.tsx";
import DeleteButton, { DeleteButtonProps } from "./ui/DeleteButton.tsx";
import ReplyButton, { ReplyButtonProps } from "./ui/ReplyButton.tsx";
import styles from "../styles/FeedbackMeta.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { User } from "../types/feedbackTypes.ts";

export type FeedbackMetaProps = {
  author: User;
  createdAt: string;
  editButton: EditButtonProps;
  removeButton: DeleteButtonProps;
  replyButton: ReplyButtonProps;
  removed: boolean;
};

export default function FeedbackMeta(props: FeedbackMetaProps) {
  const { author, createdAt, editButton, removeButton, replyButton, removed } =
    props;

  const { confirm } = removeButton;

  return (
    <div className={styles.meta}>
      <div className={styles.innerMeta}>
        <div className={`${styles.collapsable} ${confirm && styles.collapse}`}>
          <div className={styles.collapseWrapper}>
            <div className={`${styles.author} ${styles.ellipsis}`}>
              {author.username}
            </div>

            <div className={`${styles.createdAt} ${styles.ellipsis}`}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
            {!removed && <EditButton {...editButton} />}
          </div>
        </div>
        {!removed && <DeleteButton {...removeButton} />}
      </div>
      <ReplyButton {...replyButton} />
    </div>
  );
}
