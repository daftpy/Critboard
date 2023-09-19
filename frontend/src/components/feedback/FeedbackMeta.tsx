import { formatDistanceToNow } from "date-fns";
import EditButton, { EditButtonProps } from "../ui/feedback/EditButton";
import DeleteButton, { DeleteButtonProps } from "../ui/feedback/DeleteButton";
import ReplyButton, { ReplyButtonProps } from "../ui/feedback/ReplyButton";
import styles from "../../styles/components/feedback/FeedbackMeta.module.css"

export type MetaProps = {
  author: string;
  createdAt: string;
  edit: EditButtonProps;
  remove: DeleteButtonProps;
  reply: ReplyButtonProps;
  removed: boolean;
}

export default function FeedbackMeta(props: MetaProps) {
  const {
    author,
    createdAt,
    edit,
    remove,
    reply,
    removed
  } = props;

  const { confirm } = remove;

  console.log('removed value? ', removed);

  return (
    <div className={styles.meta}>
      <div className={styles.innerMeta}>
        <div className={`${styles.collapsable} ${confirm ? styles.collapse : null}`}>
          <div className={styles.collapseWrapper}>
            <div className={`${styles.author} ${styles.ellipsis}`}>
              {author}
            </div>
            <div className={`${styles.createdAt} ${styles.ellipsis}`}>
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </div>
            {!removed && <EditButton {...edit} /> }
          </div>
        </div>
        {!removed && <DeleteButton {...remove} />}
      </div>
      <ReplyButton {...reply} />
    </div>
  )
}