import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles//components/view/Template.module.css";
import buttonStyles from "../../styles/components/ui/Button.module.css";

type Props = {
  children: ReactNode;
  username?: string;
};

export default function Template({ children, username }: Props) {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_URL}/auth/twitch`;
  };
  return (
    <div className={styles.container}>
      <div className={styles.brandContainer}>
        <Link to="/">
          <h1 className={styles.brand}>Critboard</h1>
        </Link>
        {username !== "" ? (
          <h3>{username}</h3>
        ) : (
          <button
            style={{ height: "40px" }}
            className={buttonStyles.button}
            onClick={handleLogin}
          >
            Login
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
