import { ChangeEvent, FormEvent, useState } from "react";
import { IFormData, createFeedback, createReply } from "../../../services/feedback/createFeedback";
import { IFeedback } from "../../feedback/Feedback";

export function useFeedbackForm(initialData: IFormData, addFeedback: (feedback: IFeedback) => void, replyForm: boolean = false) {
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

    if (replyForm) {
      response = await createReply(formData);
    } else {
      response = await createFeedback(formData);
    }
    if (response.type === "success") {
      console.log(response.message, response.feedback);
      addFeedback(response.feedback);
      setFormData(prevState => ({
        ...prevState,
        feedbackText: ""
      }))
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