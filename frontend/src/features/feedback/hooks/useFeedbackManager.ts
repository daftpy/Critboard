// Hooks
import { useFeedbackData } from "./useFeedbackData.ts";
import { useFeedbackDisplay } from "./useFeedbackDisplay.ts";

// Services
import { getReplies } from "../services/getFeedback.ts";
import { removeFeedback } from "../services/removeFeedback.ts";

// Types
import { FeedbackData } from "../../../types/feedback/types.ts";
import { ActionType } from "../../../types/feedback/types.ts";
import { ReplyButtonProps } from "../components/ui/ReplyButton.tsx";
import { DeleteButtonProps } from "../components/ui/DeleteButton.tsx";
import { EditButtonProps } from "../components/ui/EditButton.tsx";
import { FeedbackMetaProps } from "../components/FeedbackMeta.tsx";

type EditFormProps = {
  commentId: string;
  text: string;
  buttonText: string;
  actionType: ActionType;
  onSubmit: (updateFeedback: FeedbackData) => void;
};

export function useFeedbackManager(
  feedback: FeedbackData,
  updateFeedback: (updateFeedback: FeedbackData) => void,
  incrementReply: (commentId: string) => void,
) {
  const {
    toggleForm,
    toggleShowReplies,
    toggleConfirmation,
    toggleEditMode,
    showReplies,
    editMode,
    showForm,
    showConfirmation,
  } = useFeedbackDisplay();

  const {
    feedbackData,
    setFeedbackData,
    addFeedbackData,
    updateFeedbackData,
    incrementReplyCount,
  } = useFeedbackData();

  async function fetchReplies() {
    const result = await getReplies(feedback.commentId);

    if (result.type === "success") {
      setFeedbackData(result.feedback || []);
    } else {
      console.error(result.errors);
    }
  }

  const handleRemoveFeedback = async () => {
    try {
      const removedFeedback = await removeFeedback(feedback.commentId);
      removedFeedback.feedback.removed = true;
      updateFeedback(removedFeedback.feedback);
      showConfirmation && toggleConfirmation();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleReplies = () => {
    if (showReplies) {
      toggleShowReplies();
    } else {
      fetchReplies().then(() => {
        !showReplies && toggleShowReplies();
        feedback.replies === 0 && toggleShowReplies();
      });
    }
  };

  const handleAddFeedback = (newFeedback: FeedbackData) => {
    editMode && toggleEditMode();
    incrementReply(feedback.commentId);
    addFeedbackData(newFeedback);
    !showReplies && handleToggleReplies();
    showForm && toggleForm();
  };

  const handleToggleForm = () => {
    toggleForm();
  };

  const childHandleIncrementReply = (commentId: string) => {
    incrementReplyCount(commentId);
  };

  function getButtonProps() {
    return {
      editButton: <EditButtonProps>{
        editMode: editMode,
        onClick: toggleEditMode,
      },
      removeButton: <DeleteButtonProps>{
        onClick: handleRemoveFeedback,
        confirm: showConfirmation,
        toggleConfirm: toggleConfirmation,
      },
      replyButton: <ReplyButtonProps>{
        toggleReplies: handleToggleReplies,
        toggleForm: toggleForm,
        replyCount: feedback.replies,
        showForm: showForm,
        showReplies: showReplies,
      },
    };
  }

  const getMetaProps = (): FeedbackMetaProps => {
    const { editButton, removeButton, replyButton } = getButtonProps();
    return {
      editButton,
      removeButton,
      replyButton,
      createdAt: feedback.createdAt,
      author: "author",
      removed: feedback.removed,
    };
  };

  const getEditFormProps = (): EditFormProps => {
    return {
      commentId: feedback.commentId,
      text: feedback.feedbackText,
      buttonText: "Save Edit",
      actionType: "UPDATE",
      onSubmit: (data: FeedbackData) => {
        updateFeedback(data);
        toggleEditMode();
      },
    };
  };

  return {
    showReplies,
    showForm,
    editMode,
    feedbackData,
    childUpdateFeedbackData: updateFeedbackData,
    childHandleIncrementReply,
    handleToggleForm,
    handleToggleReplies,
    handleAddFeedback,
    getMetaProps,
    getEditFormProps,
  };
}
