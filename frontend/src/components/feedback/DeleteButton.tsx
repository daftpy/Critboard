import { useState } from "react";
import Button from "../ui/Button";

interface IProps {
  removeFeedback?: () => void;
}

export default function DeleteButton({ removeFeedback }: IProps) {
  const [confirm, setConfirm] = useState<boolean>(false);
  return (
    <>
      {confirm ? (
        <>
          <div>
            Are you Sure?
          </div>
          <Button
            message="Yes"
            size="xsmall"
            onClick={() => setConfirm(true)}
          />
          <Button
            message="Cancel"
            size="xsmall"
            onClick={() => setConfirm(false)}
          />
        </>
      ) : (
        <Button
          message="Delete"
          size="xsmall"
          onClick={() => setConfirm(true)}
        />
      )}
    </>
  )
}