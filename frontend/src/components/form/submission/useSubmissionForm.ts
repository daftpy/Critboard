import { ChangeEvent, FormEvent, useState } from "react";
import { createLinkSubmission } from "../../../services/submission/createLinkSubmission.ts";
import { NavigateFunction } from "react-router-dom";
import { createFileSubmission } from "../../../services/submission/createFileSubmission.ts";
import { uploadFile } from "../../../services/submission/createFileUpload.ts";

export interface IFormData {
  title: string;
  description: string;
  type: "LINK" | "FILE";
  link?: string;
  upload_data?: FileResponse;
}

type FileResponse = {
  id: string;
  file_path: string;
  file_name: string;
  file_extension: string;
};

type SubmissionData = {
  fileDetail?: FileResponse;
  linkDetail?: { link: string };
  commentId: string;
  title: string;
  description: string;
  type: "FILE" | "LINK";
  createdAt: string;
  updatedAt: string;
};

type ISuccessResponse = {
  type: "success";
  message: string;
  submission: SubmissionData;
};

type IErrorResponse = {
  type: "error";
  errors: string[];
};

type SubmissionResponse = ISuccessResponse | IErrorResponse;

export function useSubmissionForm(
  initialData: IFormData,
  navigate: NavigateFunction,
) {
  const [formData, setFormData] = useState<IFormData>(initialData);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Holds the submission type of the form: either "LINK" or "FILE"
  const [currentType, setType] = useState<string>("LINK");

  const changeType = (type: string) => {
    setType(type);
    setFormData((prevState) => ({
      ...prevState,
      type: type as "LINK" | "FILE",
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    console.log("Handling change");

    // Update formData based on the input name and value.
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleChangeFile(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  }

  const handleSubmitFile = async () => {
    console.log("uploading", selectedFile);
    // upload file to server, get response, set formdata with FileResponse
    if (selectedFile) {
      const response = await uploadFile(selectedFile);
      response.type === "success" && console.log(response.upload);
      if (response.upload) {
        const upload = response.upload;
        setFormData((prevState) => ({
          ...prevState,
          upload_data: {
            id: upload.id,
            file_path: upload.file_path,
            file_name: upload.file_name,
            file_extension: upload.file_extension,
          },
        }));
      }
    } else {
      console.error("No file selected.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response: SubmissionResponse =
      formData.type == "LINK"
        ? await createLinkSubmission(formData)
        : await createFileSubmission(formData);

    if (response.type === "success") {
      console.log(response.message);
      console.log(response.submission);
      navigate(`/submission/${response.submission.commentId}`, {
        state: { submissionData: response.submission },
      });
    } else {
      console.log(response.errors);
    }
  };

  return {
    formData,
    setFormData,
    currentType,
    changeType,
    handleChange,
    handleSubmit,
    handleChangeFile,
    handleSubmitFile,
  };
}
