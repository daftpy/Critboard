import { ChangeEvent, FormEvent, useState } from "react";
import { FeedbackFormData } from "../types/feedbackTypes.ts";
import { createFeedback, createReply } from "../services/createFeedback.ts";
import { FeedbackData } from "../types/feedbackTypes.ts";
import { updateFeedback } from "../services/updateFeedback.ts";
import { ActionType } from "../types/feedbackTypes.ts";

type Props = {
  initialData: FeedbackFormData;
  onSubmit: (feedback: FeedbackData) => void;
  replyForm?: boolean;
  actionType?: ActionType;
};

export function useFeedbackForm({
  initialData,
  onSubmit,
  replyForm = false,
  actionType = "POST",
}: Props) {
  const [formData, setFormData] = useState<FeedbackFormData>(initialData);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log("Handling change");

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response;

    if (actionType === "POST") {
      // If reply form, hit the reply endpoint, if not hit the feedback endpoint
      response = replyForm
        ? await createReply(formData)
        : await createFeedback(formData);
    } else {
      response = await updateFeedback(formData);
    }

    if (response.type === "success") {
      console.log(response.message, response.feedback);
      onSubmit(response.feedback);

      setFormData((prevState) => ({
        ...prevState,
        feedbackText: "",
      }));
    } else {
      console.log(response.errors);
      setFormErrors(response.errors);
    }
  };

  return {
    formData,
    formErrors,
    setFormData,
    handleChange,
    handleSubmit,
  };
}
