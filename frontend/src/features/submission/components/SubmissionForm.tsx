import { useNavigate } from "react-router-dom";
import styles from "../styles/preview/SubmissionForm.module.css";
import Button from "../../../components/ui/Button.tsx";
import TextInput from "../../../components/ui/TextInput.tsx";
import TypeSelector from "./TypeSelector.tsx";
import { useSubmissionForm } from "../hooks/useSubmissionForm.ts";
import { SubmissionFormData } from "../types/submissionTypes.ts";

export default function SubmissionForm() {
  const navigate = useNavigate();

  const inititalData: SubmissionFormData = {
    title: "",
    description: "",
    type: "LINK",
    link: "",
  };

  const {
    formData,
    formErrors,
    currentType,
    changeType,
    handleChange,
    handleSubmit,
    handleChangeFile,
    handleSubmitFile,
  } = useSubmissionForm(inititalData, navigate);

  const typeField =
    currentType === "LINK" ? (
      <>
        <label>
          Link{" "}
          {formErrors.includes("Error parsing link") && (
            <span className={styles.error}> error parsing</span>
          )}
        </label>
        <TextInput
          name="link"
          value={formData.link ? formData.link : ""}
          placeholder="https://example.com"
          onChange={handleChange}
        />
      </>
    ) : (
      <>
        <label>
          File{" "}
          {formErrors.includes("No file selected") && (
            <span className={styles.error}> none selected</span>
          )}
        </label>

        <input
          type="file"
          name="file"
          onChange={handleChangeFile} // This needs a special handler
        />
        <button onClick={handleSubmitFile} type="button">
          upload
        </button>
      </>
    );

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputField}>
        <label>
          Title{" "}
          {formErrors.includes("Title too short") && (
            <span className={styles.error}> too short</span>
          )}
        </label>
        <TextInput
          name="title"
          value={formData.title}
          placeholder="Enter a title"
          onChange={handleChange}
        />
      </div>
      <div className={styles.inputField}>
        <label>
          Description{" "}
          {formErrors.includes("Description too short") && (
            <span className={styles.error}> too short</span>
          )}
        </label>

        <textarea
          onChange={handleChange}
          className={styles.textArea}
          name="description"
          value={formData.description}
          placeholder="Enter your description"
        />
      </div>
      <div>
        <TypeSelector selectType={changeType} currentType={currentType} />
        <div className={`${styles.typeField} ${styles.inputField}`}>
          {typeField}
        </div>
      </div>
      <Button message="Submit" />
    </form>
  );
}
