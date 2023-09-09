import React, { ChangeEvent } from "react";
import styles from "../../styles/components/ui/TextInput.module.css"

interface TextInputProps {
  placeholder?: string;
  value: string;
  name: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void

  style?: React.CSSProperties;
}

export default function TextInput({ placeholder = "Enter text here", value, name, onChange, style }: TextInputProps) {

  return (
    <input
      onChange={onChange}
      className={styles.textInput}
      type="text"
      name={name}
      value={value}
      placeholder={placeholder}
      style={style}
    />
  )
}
