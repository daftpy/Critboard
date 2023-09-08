import styles from "../../styles/components/feedback/ReplyButton.module.css"
import buttonStyles from "../../styles/components/ui/Button.module.css"

interface IReplyButtonProps {
  toggleReplies: () => void;
  toggleForm: () => void;
  replyCount: number;
  showForm: boolean;
  showReplies: boolean;
}

export default function ReplyButton({ toggleReplies, toggleForm, replyCount, showForm, showReplies}: IReplyButtonProps) {
  return (
    <>
    {showReplies ? (
      <div className={styles.wrapper}>
        {replyCount !== 0 ? (
          <>
            <button onClick={toggleForm} className={styles.replyButton}>Reply</button>
            <button className={styles.closeButton} onClick={toggleReplies}>x</button>       
          </>
        ) : (
          showForm ? (
            <button onClick={toggleForm} className={`${styles.replyButton} ${styles.buttonFull}`}>x</button>
          ) : (
            <button onClick={toggleForm} className={`${styles.replyButton} ${styles.buttonFull}`}>Reply</button>
          )
        )}
      </div>
    ) : (
      <button className={`${buttonStyles.button} ${buttonStyles.small}`} onClick={toggleReplies}>
        {replyCount > 0 ? replyCount : null} {replyCount > 1 ? 'Replies' : 'Reply'}
      </button>
    )}
    </>
  )
}