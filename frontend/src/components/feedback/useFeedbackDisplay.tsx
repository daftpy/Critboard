import { useState } from "react";

export function useFeedbackDisplay() {
  const [showReplies, setShowReplies] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showConfirmation, setShowConfirm] = useState<boolean>(false);

  const toggleForm = () => setShowForm(!showForm);

  const toggleShowReplies = () => setShowReplies(!showReplies);

  const toggleEditMode = () => setEditMode(!editMode);

  const toggleConfirmation = () => setShowConfirm(!showConfirmation);

  return {
    toggleForm,
    toggleShowReplies,
    toggleEditMode,
    toggleConfirmation,
    showReplies,
    editMode,
    showForm,
    showConfirmation,
  };
}
