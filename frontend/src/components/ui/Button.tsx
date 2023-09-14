import React from "react";
import styles from "../../styles/components/ui/Button.module.css"

interface ButtonProps {
  onClick?: () => void;
  message?: string;
  size?: 'xsmall' | 'small' | 'large';
  style?: React.CSSProperties;
}

export default function Button({ onClick, message = "Submit", size, style }: ButtonProps) {

  // Determine additional styles
  let buttonStyle = styles.button;

  if (size) {
    buttonStyle += ` ${styles[size]}`;
  }

  return (
    <button className={buttonStyle} style={style} onClick={onClick}>
      {message}
    </button>
  )
}
