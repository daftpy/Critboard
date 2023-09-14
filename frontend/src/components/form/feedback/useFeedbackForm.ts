import { ChangeEvent, FormEvent, useState } from "react";
import { IFormData, createFeedback, createReply } from "../../../services/feedback/createFeedback";
import { IFeedback } from "../../feedback/Feedback";
import { updateFeedback } from "../../../services/feedback/updateFeedback";

type ActionType = "POST" | "UPDATE" | "DELETE";

interface IProps {
  initialData: IFormData,
  addFeedback: (feedback: IFeedback) => void;
  replyForm?: boolean;
  actionType?: ActionType;
  updateText?: (text: string) => void;
}

export function useFeedbackForm({
  initialData,
  addFeedback,
  replyForm = false,
  actionType = "POST",
  updateText
}: IProps) {
  const [formData, setFormData] = useState<IFormData>(initialData);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("Handling change");

    // Update formData based on the input name and value.
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
      let newText = response.feedback.feedbackText;
      updateText ? updateText(newText): null;
      console.log('update response', newText);
      addFeedback(response.feedback);
      if (replyForm) {
        setFormData(prevState => ({
          ...prevState,
          feedbackText: ""
        }))
      } else {
        setFormData(prevState => ({
          ...prevState,
          feedbackText: newText
        }))
      }
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