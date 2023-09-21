import { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles//components/view/Template.module.css";
import buttonStyles from "../../styles/components/ui/Button.module.css";

interface TemplateProps {
  children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.brandContainer}>
        <Link to="/">
          <h1 className={styles.brand}>Critboard</h1>
        </Link>
        <button style={{ height: "40px" }} className={buttonStyles.button}>
          Login
        </button>
      </div>
      {children}
    </div>
  );
}
