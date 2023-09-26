import { ChangeEvent, FormEvent, useState } from "react";
import {
  IFormData,
  createFeedback,
  createReply,
} from "../services/createFeedback.ts";
import { FeedbackData } from "../../../types/feedback/types.ts";
import { updateFeedback } from "../services/updateFeedback.ts";

export type ActionType = "POST" | "UPDATE" | "DELETE";

type Props = {
  initialData: IFormData;
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
  const [formData, setFormData] = useState<IFormData>(initialData);

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
    }
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
  };
}
