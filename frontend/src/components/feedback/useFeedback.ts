import { useState } from "react";
import { getReplies } from "../../services/feedback/getFeedback";
import { FeedbackData } from "./Feedback";
import { useFeedbackData } from "./useFeedbackData";
import { MetaProps } from "./FeedbackMeta";
import { ActionType } from "../form/feedback/useFeedbackForm";
import { ReplyButtonProps } from "../ui/feedback/ReplyButton";
import { DeleteButtonProps } from "../ui/feedback/DeleteButton";
import { EditButtonProps } from "../ui/feedback/EditButton";
import { removeFeedback } from "../../services/feedback/removeFeedback";

type EditFormProps = {
  commentId: string;
  text: string;
  buttonText: string;
  actionType: ActionType;
  onSubmit: (updatedFeedback: FeedbackData) => void;
}

export function useFeedback(feedback: FeedbackData, updateFeedback: (updatedFeedback: FeedbackData) => void, incrementReply: (commentId: string) => void) {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);

  const {
    feedbackData,
    setFeedbackData,
    addFeedbackData,
    updateFeedbackData,
    incrementReplyCount
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

  const toggleForm = () => setShowForm(!showForm);

  const toggleEditMode = () => setEditMode(!editMode);
  
  const setConfirm = (confirm: boolean) => setDeleteConfirm(confirm);

  const deleteFeedback = async () => {
    try {
      const removedFeedback = await removeFeedback(feedback.commentId);
      console.log('Removed', removedFeedback);
      updateFeedback(removedFeedback.feedback);
      setConfirm(false);
    } catch (error) {
      console.log("Error removing feedback:", error);
    }
  }

  const toggleReplies = () => {

    if (showReplies) {
      setShowReplies(false);
    } else {
      fetchReplies().then(() => {
        setShowReplies(true);
        if (feedback.replies === 0) {
          setShowForm(true);
        }
      })
    }
  }

  const addFeedback = (newFeedback: FeedbackData) => {
    if (editMode) {
      setEditMode(false);
      console.log('closing edit form');
    } else {
      incrementReply(feedback.commentId);
      addFeedbackData(newFeedback);
      if (!showReplies) {
        toggleReplies();
      }
      setShowForm(false);
    }
  }

  function getButtonProps() {
    return {
      edit: <EditButtonProps> {
        editMode: editMode,
        onClick: toggleEditMode
      },
      remove: <DeleteButtonProps> {
        onClick: deleteFeedback,
        confirm: deleteConfirm,
        setConfirm: setConfirm
      },
      reply: <ReplyButtonProps> {
        toggleReplies: toggleReplies,
        toggleForm: toggleForm,
        replyCount: feedback.replies,
        showForm: showForm,
        showReplies: showReplies
      }
    };
  }

  const getMetaProps = (): MetaProps => {
    const { edit, remove, reply } = getButtonProps();
    return {
      edit,
      remove,
      reply,
      createdAt: feedback.createdAt,
      author: "author"
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
      }
    }
  }

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
    getEditFormProps
  }
}
