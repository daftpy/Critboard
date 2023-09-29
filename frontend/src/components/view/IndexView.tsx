import Button from "../ui/Button";
import Template from "./Template";
import styles from "../../styles/components/view/IndexView.module.css";
import { useNavigate } from "react-router-dom";
import { PreviewList } from "../../features/submission/components/PreviewList.tsx";
import { useEffect, useState } from "react";
import { getUsers } from "../../services/getUsers.ts";

export default function IndexView() {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");

  const handleClick = () => navigate("/submit");

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await getUsers();
      setUsername(res.user.username);
    };

    fetchUsers();
  }, []);

  return (
    <Template username={username}>
      <div className={styles.hero}>
        <p className={styles.callToAction}>
          <span style={{ fontWeight: "500" }}>Critboard </span>
          is a place where users can connect with artists and creators they
          admire to receive critical feedback on their work.
        </p>
        <Button onClick={handleClick} message="Submit" size="large" />
      </div>
      <PreviewList />
    </Template>
  );
}
