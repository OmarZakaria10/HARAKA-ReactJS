import { useRef } from "react";
import CustomModal from "./CustomModal";
import CustomButton from "./CustomButton";

export default function PopUp({
  button = true,
  disabled = false,
  children,
  title,
  buttonTitle,
  AddModal,
  setAddModal,
}) {
  const firstInputRef = useRef(null);

  return (
    <>
      <CustomButton
        onClick={() => !disabled && setAddModal(true)}
        variant="primary"
        size="sm"
        disabled={disabled}
      >
        {buttonTitle}
      </CustomButton>
      <CustomModal
        isOpen={AddModal}
        onClose={() => setAddModal(false)}
        initialFocus={firstInputRef}
        title={title}
      >
        {children}
      </CustomModal>
    </>
  );
}
