import { ChangeEvent, FormEvent, useState } from "react";
import { createSubmission } from "../../../services/apiUtils";
import { NavigateFunction } from "react-router-dom";

export interface IFormData {
    title: string;
    description: string;
    type: 'LINK' | 'FILE';
    link: string;
}

interface ISuccessResponse {
  type: "success",
  message: string,
  submission: {
    commentId: string;
    title: string;
    description: string;
    type: 'LINK' | 'FILE';
    link: string;
    createdAt: string;
    updatedAt: string;
  }
}

interface IErrorResponse {
  type: "error";
  errors: string[];
}

type SubmissionResponse = ISuccessResponse | IErrorResponse;

export function useSubmissionForm(initialData: IFormData, navigate: NavigateFunction) {
    const [formData, setFormData] = useState<IFormData>(initialData);

    // Holds the submission type of the form: either "LINK" or "FILE"
    const [currentType, setType] = useState<string>("LINK");

    const changeType = (type: string) => {
      setType(type);
    }

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
    const response: SubmissionResponse = await createSubmission(formData);
    if (response.type === "success") {
      console.log(response.message);
      console.log(response.submission);
      navigate(`/submission/${response.submission.commentId}`, {
        state: { submissionData: response.submission }
      });

    } else {
      console.log(response.errors);
    }
  }

    return {
      formData,
      setFormData,
      currentType,
      changeType,
      handleChange,
      handleSubmit
    }
}
