import { useEffect, useState } from "react";
import { SubmissionPreviewData } from "../types/submissionTypes.ts";
import { getRecent } from "../services/getRecent.ts";
import { SubmissionPreview } from "./SubmissionPreview.tsx";
import styles from "../styles/preview/PreviewList.module.css";

export function PreviewList() {
  const [previews, setPreviews] = useState<SubmissionPreviewData[]>([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const response = await getRecent(10);
      if (response.type === "success") {
        setPreviews(response.submissions);
      }
    };

    fetchSubmissions();
  }, []);
  return (
    <div className={styles.container}>
      <h2>Recent Submissions</h2>
      <div className={styles.previews}>
        {previews &&
          previews.map((preview: SubmissionPreviewData) => (
            <SubmissionPreview key={preview.commentId} submission={preview} />
          ))}
      </div>
    </div>
  );
}
