export type PreviewData = {
  commentId: string;
  title: string;
  author: string;
  createdAt: string;
  description: string;
  type: "FILE" | "LINK";
  replyCount?: number;
};
