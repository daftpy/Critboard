import Button from "../ui/Button";
import Template from "./Template";

import styles from "../../styles/components/view/IndexView.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRecent } from "../../services/submission/getRecent";
import { IPreview } from "../submission/SubmissionPreview";
import { SubmissionPreview } from "../submission/SubmissionPreview";

export default function IndexView() {
  const navigate = useNavigate();

  const handleClick = () => navigate("/submit");

  const [recentSubmissions, setRecent] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissions = await getRecent(10);
      if (submissions.type === "success") {
        setRecent(submissions.submissions);
      }
    };

    fetchSubmissions();
  }, []);
  return (
    <Template>
      <div className={styles.hero}>
        <p className={styles.callToAction}>
          <span style={{ fontWeight: "500" }}>Critboard </span>
          is a place where users can connect with artists and creators they
          admire to receive critical feedback on their work.
        </p>
        <Button onClick={handleClick} message="Submit" size="large" />
      </div>
      <div className={styles.recent}>
        <h2>Recent Submissions</h2>
        <div className={styles.previews}>
          {recentSubmissions
            ? recentSubmissions.map((submission: IPreview) => (
                <SubmissionPreview submission={submission} />
              ))
            : null}
        </div>
      </div>
    </Template>
  );
}
