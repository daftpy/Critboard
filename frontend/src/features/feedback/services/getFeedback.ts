import { GetFeedbackResponse } from "../types/serviceTypes.ts";

export async function getReplies(
  commentId: string,
): Promise<GetFeedbackResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/feedback/${commentId}/replies`,
      {
        method: "GET",
        headers: {},
      },
    );

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response:", rawResponse);

    const data = await response.json();

    if (response.ok) {
      return { type: "success", feedback: data };
    } else {
      return { type: "error", errors: data.errors };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
