import { ChangeEvent, FormEvent, useState } from "react";
import { createLinkSubmission } from "../services/createLinkSubmission.ts";
import { NavigateFunction } from "react-router-dom";
import { createFileSubmission } from "../services/createFileSubmission.ts";
import { uploadFile } from "../services/createFileUpload.ts";
import { SubmissionFormData } from "../types/submissionTypes.ts";
import { CreateSubmissionResponse } from "../types/serviceTypes.ts";

export function useSubmissionForm(
  initialData: SubmissionFormData,
  navigate: NavigateFunction,
) {
  const [formData, setFormData] = useState<SubmissionFormData>(initialData);
  const [formErrors, setFormErrors] = useState<string[]>([]);

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
      const newErrors = [...formErrors, "No file selected"];
      setFormErrors(newErrors);
      console.error("No file selected");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response: CreateSubmissionResponse =
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
      setFormErrors(response.errors);
    }
  };

  return {
    formData,
    setFormData,
    currentType,
    formErrors,
    changeType,
    handleChange,
    handleSubmit,
    handleChangeFile,
    handleSubmitFile,
  };
}
