import { ChangeEvent, FormEvent, useState } from "react";
import { IFormData, createFeedback, createReply } from "../../../services/feedback/createFeedback";
import { FeedbackData } from "../../feedback/Feedback";
import { updateFeedback } from "../../../services/feedback/updateFeedback";

export type ActionType = "POST" | "UPDATE" | "DELETE";

interface IProps {
  initialData: IFormData,
  onSubmit: (feedback: FeedbackData) => void;
  replyForm?: boolean;
  actionType?: ActionType;
}

export function useFeedbackForm({
  initialData,
  onSubmit,
  replyForm = false,
  actionType = "POST",
}: IProps) {
  const [formData, setFormData] = useState<IFormData>(initialData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Handling change");

    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let response;

    if (actionType === "POST") {
      response = replyForm ? await createReply(formData) : await createFeedback(formData);
    } else {
      response = await updateFeedback(formData);
    }

    if (response.type === "success") {
      console.log(response.message, response.feedback);
      onSubmit(response.feedback);

      setFormData(prevState => ({
        ...prevState,
        feedbackText: ""
      }));
    } else {
      console.log(response.errors);
    }
  }

  return {
    formData,
    setFormData,
    handleChange,
    handleSubmit
  }
}