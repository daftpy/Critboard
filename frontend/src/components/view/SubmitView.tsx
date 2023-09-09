import Button from "../ui/Button"
import Template from "./Template"

import styles from "../../styles/components/view/SubmitView.module.css"
import { useState } from "react"
import SubmissionForm from "../form/submission/SubmissionForm";

export default function SubmitView() {
  const [showForm, setShowForm] = useState(false);

  const buttonStyle = {fontWeight: 500}

  const showFreeForm = () => {
    setShowForm(true);
  }

  return (
    <Template>
      {showForm ? (
        <SubmissionForm />
      ) : (
        <>
          <h2 style={{textAlign: "center"}}>SUBMISSION PAGE</h2>
          <p style={{marginTop: "0.5em", textAlign: "center"}}>Please ensure all submissions conform to our community guidelines.</p>
          <div className={styles.hero}>
            <h3>Submission Guidelines</h3>
              <p className={styles.agreement}>
                By proceeding in the submission process you agree to abide by the following guidelines or 
                your submission may be removed. 
              </p>
              <ul className={styles.guideLinesContainer}>
                <li>Only share content you own or have the right to share.</li>
                <li>Ensure your submissions align with our community standards.</li>
                <li>Respect content embargoes; do not share unreleased or leaked media.</li>
              </ul>
          </div>
          <div className={styles.selectionContainer}>
            <div>
              <p>Recieve feedback from a community of engaged artists and creators.</p>
              <Button message="Free Submission" style={buttonStyle} onClick={showFreeForm} />
            </div>
            <div>
              <p>Receive feedback from our community as well as gauranteed feedback from @admin</p>
              <Button message="Premium Submission" style={buttonStyle} />
            </div>
          </div>
        </>
      )}
    </Template>
  )
}