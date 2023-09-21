import Button from "../Button";

export type DeleteButtonProps = {
  onClick: () => void;
  confirm: boolean;
  toggleConfirm: () => void;
};

export default function DeleteButton({
  onClick,
  confirm,
  toggleConfirm,
}: DeleteButtonProps) {
  return (
    <>
      {confirm ? (
        <>
          <div>Are you Sure?</div>
          <Button message="Yes" size="xsmall" onClick={onClick} />
          <Button
            message="Cancel"
            size="xsmall"
            onClick={() => {confirm && toggleConfirm();}}
          />
        </>
      ) : (
        <Button
          message="Delete"
          size="xsmall"
          onClick={() => {!confirm && toggleConfirm();}}
        />
      )}
    </>
  );
}
