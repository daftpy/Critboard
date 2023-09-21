import Button from "../Button";

export type DeleteButtonProps = {
  onClick: () => void;
  confirm: boolean;
  setConfirm: (confirm: boolean) => void;
};

export default function DeleteButton({
  onClick,
  confirm,
  setConfirm,
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
  );
}
