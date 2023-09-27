import { FeedbackFormData } from "../types/feedbackTypes.ts";

export async function createFeedback(formData: FeedbackFormData) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/submissions/${formData.commentId}/feedback`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    );

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response: ", rawResponse);

    const data = await response.json();

    if (response.ok) {
      return {
        type: "success",
        message: data.message,
        feedback: data.feedback,
      };
    } else {
      return { type: "error", errors: data.errors };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}

export async function createReply(formData: FeedbackFormData) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/feedback/${formData.commentId}/replies`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      },
    );

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response: ", rawResponse);

    const data = await response.json();

    if (response.ok) {
      return {
        type: "success",
        message: data.message,
        feedback: data.feedback,
      };
    } else {
      return { type: "error", errors: data.errors };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
