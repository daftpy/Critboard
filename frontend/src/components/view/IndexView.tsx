import Button from "../ui/Button"
import Template from "./Template"

import styles from "../../styles/components/view/IndexView.module.css"
import { useNavigate } from "react-router-dom"

export default function IndexView() {
  const navigate = useNavigate();
  
  const handleClick = () => navigate("/submit");
  return (
    <Template>
      <div className={styles.hero}>
        <p className={styles.callToAction}>
          <span style={{fontWeight: "500"}}>Critboard </span>
          is a place where users can connect with artists and creators they admire to receive critical feedback on their work.
        </p>
        <Button onClick={handleClick} message="Submit" size="large"/>
      </div>
    </Template>
  )
}