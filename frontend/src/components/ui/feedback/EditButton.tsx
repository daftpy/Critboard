import Button from "../Button";

export type EditButtonProps = {
  editMode: boolean;
  onClick: () => void;
};

export default function EditButton({ editMode, onClick }: EditButtonProps) {
  return (
    <Button
      message={editMode ? "Cancel" : "Edit"}
      onClick={onClick}
      size="xsmall"
      style={editMode ? { backgroundColor: "#676767", color: "#f0f0f0" } : {}}
    />
  );
}
