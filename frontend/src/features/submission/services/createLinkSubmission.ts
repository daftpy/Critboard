import { SubmissionFormData } from "../types/submissionTypes.ts";

interface SuccessResponse {
  type: "success";
  message: string;
  submission: any;
  feedback?: any;
}

interface ErrorResonse {
  type: "error";
  errors: string[];
}

type SubmissionResponse = SuccessResponse | ErrorResonse;

export async function createLinkSubmission(
  submissionData: SubmissionFormData,
): Promise<SubmissionResponse> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_URL}/api/submissions/link/create`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      },
    );

    const clonedResponse = response.clone();

    const rawResponse = await clonedResponse.text();
    console.log("Raw response: ", rawResponse);

    // Attempt to parse the JSON
    const data = await response.json();

    if (response.ok) {
      return {
        type: "success",
        message: data.message,
        submission: data.submission,
      };
    } else {
      return {
        type: "error",
        errors: data.errors,
      };
    }
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.log("There was a problem: ", errorMessage);
    return { type: "error", errors: [errorMessage] };
  }
}
