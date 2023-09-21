import { getReplies } from "../../services/feedback/getFeedback";
import { FeedbackData } from "./Feedback";
import { useFeedbackData } from "./useFeedbackData";
import { MetaProps } from "./FeedbackMeta";
import { ActionType } from "../form/feedback/useFeedbackForm";
import { ReplyButtonProps } from "../ui/feedback/ReplyButton";
import { DeleteButtonProps } from "../ui/feedback/DeleteButton";
import { EditButtonProps } from "../ui/feedback/EditButton";
import { removeFeedback } from "../../services/feedback/removeFeedback";
import { useFeedbackDisplay } from "./useFeedbackDisplay.tsx";

type EditFormProps = {
  commentId: string;
  text: string;
  buttonText: string;
  actionType: ActionType;
  onSubmit: (updatedFeedback: FeedbackData) => void;
};

export function useFeedback(
  feedback: FeedbackData,
  updateFeedback: (updatedFeedback: FeedbackData) => void,
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
      console.log(result);
      setFeedbackData(result.feedback || []);
    } else {
      console.error(result.errors);
    }
  }

  const deleteFeedback = async () => {
    try {
      const removedFeedback = await removeFeedback(feedback.commentId);
      removedFeedback.feedback.removed = true;
      console.log("Removed", removedFeedback);
      updateFeedback(removedFeedback.feedback);
      showConfirmation && toggleConfirmation();
    } catch (error) {
      console.log("Error removing feedback:", error);
    }
  };

  const toggleReplies = () => {
    if (showReplies) {
      toggleShowReplies();
    } else {
      fetchReplies().then(() => {
        !showReplies && toggleShowReplies();
        feedback.replies === 0 && toggleShowReplies();
      });
    }
  };

  const addFeedback = (newFeedback: FeedbackData) => {
    editMode && toggleEditMode();
    incrementReply(feedback.commentId);
    addFeedbackData(newFeedback);
    !showReplies && toggleReplies();
    showForm && toggleForm();
  };

  function getButtonProps() {
    return {
      edit: <EditButtonProps>{
        editMode: editMode,
        onClick: toggleEditMode,
      },
      remove: <DeleteButtonProps>{
        onClick: deleteFeedback,
        confirm: showConfirmation,
        toggleConfirm: toggleConfirmation,
      },
      reply: <ReplyButtonProps>{
        toggleReplies: toggleReplies,
        toggleForm: toggleForm,
        replyCount: feedback.replies,
        showForm: showForm,
        showReplies: showReplies,
      },
    };
  }

  console.log("hook removed value?", feedback.removed);

  const getMetaProps = (): MetaProps => {
    const { edit, remove, reply } = getButtonProps();
    return {
      edit,
      remove,
      reply,
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
    updateFeedbackData,
    incrementReplyCount,
    toggleForm,
    toggleReplies,
    addFeedback,
    getMetaProps,
    getEditFormProps,
  };
}
