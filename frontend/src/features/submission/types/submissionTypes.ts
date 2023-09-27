import { UploadFileResponse } from "./serviceTypes.ts";

export type SubmissionData = {
  fileDetail?: FileDetails;
  linkDetail?: { link: string };
  commentId: string;
  title: string;
  description: string;
  type: "FILE" | "LINK";
  createdAt: string;
  updatedAt: string;
};

export type FileDetails = {
  id: string;
  file_path: string;
  file_name: string;
  file_extension: string;
};

export type SubmissionFormData = {
  title: string;
  description: string;
  type: "LINK" | "FILE";
  link?: string;
  upload_data?: UploadFileResponse;
};

export type SubmissionPreviewData = {
  commentId: string;
  title: string;
  author: string;
  createdAt: string;
  description: string;
  type: "FILE" | "LINK";
  replyCount?: number;
};
