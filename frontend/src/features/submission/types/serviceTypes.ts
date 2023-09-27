import { SubmissionData } from "./submissionTypes.ts";

export type UploadFileResponse = {
  id: string;
  file_path: string;
  file_name: string;
  file_extension: string;
};

export type SubmissionSuccessResponse = {
  type: "success";
  message: string;
  submission: SubmissionData;
};

export type SubmissionErrorResponse = {
  type: "error";
  errors: string[];
};

export type CreateSubmissionResponse =
  | SubmissionSuccessResponse
  | SubmissionErrorResponse;
