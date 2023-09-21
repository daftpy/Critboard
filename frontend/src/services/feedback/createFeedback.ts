export interface IFormData {
  feedbackText: string;
  commentId: string;
}

export async function createFeedback(formData: IFormData) {
  try {
    const response = await fetch(
      `http://localhost:3000/submissions/${formData.commentId}/feedback`,
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

export async function createReply(formData: IFormData) {
  try {
    const response = await fetch(
      `http://localhost:3000/feedback/${formData.commentId}/replies`,
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
