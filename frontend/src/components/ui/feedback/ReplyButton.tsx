import styles from "../../../styles/components/feedback/ReplyButton.module.css";

export type ReplyButtonProps = {
  toggleReplies: () => void;
  toggleForm: () => void;
  replyCount: number;
  showForm: boolean;
  showReplies: boolean;
};

export default function ReplyButton({
  toggleReplies,
  toggleForm,
  replyCount,
  showForm,
  showReplies,
}: ReplyButtonProps) {
  return (
    <>
      {showReplies ? (
        <div className={styles.wrapper}>
          {replyCount !== 0 ? (
            <>
              <button onClick={toggleForm} className={styles.replyButton}>
                Reply
              </button>
              <button className={styles.closeButton} onClick={toggleReplies}>
                x
              </button>
            </>
          ) : (
            <button
              onClick={toggleForm}
              className={`${styles.replyButton} ${styles.buttonFull}`}
            >
              {showForm ? <>x</> : <>Reply</>}
            </button>
          )}
        </div>
      ) : (
        <div className={styles.wrapper}>
          <button
            onClick={toggleForm}
            className={`${styles.replyButton}
          ${replyCount === 0 ? styles.buttonFull : null}`}
          >
            Reply
          </button>

          {replyCount > 0 ? (
            <button className={styles.closeButton} onClick={toggleReplies}>
              + {replyCount}
            </button>
          ) : null}
        </div>
      )}
    </>
  );
}
