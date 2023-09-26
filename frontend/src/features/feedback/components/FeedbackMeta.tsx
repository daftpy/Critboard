import EditButton, {
  EditButtonProps,
} from "../../../components/ui/feedback/EditButton.tsx";
import DeleteButton, {
  DeleteButtonProps,
} from "../../../components/ui/feedback/DeleteButton.tsx";
import ReplyButton, {
  ReplyButtonProps,
} from "../../../components/ui/feedback/ReplyButton.tsx";
import styles from "../styles/FeedbackMeta.module.css";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

export type FeedbackMetaProps = {
  author: string;
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
              {author}
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
