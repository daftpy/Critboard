import styles from "../../../styles/components/form/submission/TypeSelector.module.css"

interface TypeSelectorProps {
  selectType: (type: string) => void,
  currentType: string
}

export default function TypeSelector({currentType, selectType }:TypeSelectorProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.selector} ${currentType === "LINK" ? null : styles.inActive}`}
        onClick={() => selectType("LINK")}
        type="button"
      >
        Link
      </button>
      <button
        className={`${styles.selector} ${currentType === "FILE" ? null : styles.inActive}`}
        onClick={() => selectType("FILE")}
        type="button"
      >
        File
      </button>
    </div>
  )
}