import { Button } from "flowbite-react";
import { useRef } from "react";
import CustomModal from "./CustomModal";

export default function PopUp({
  button =true,
  children,
  title,
  buttonTitle,
  AddModal,
  setAddModal,
}) {
  const firstInputRef = useRef(null);

  return (
    <>
      {button && <Button onClick={() => setAddModal(true)}>{buttonTitle}</Button>}
      <CustomModal
        isOpen={AddModal}
        onClose={() => setAddModal(false)}
        initialFocus={firstInputRef}
        title={title}
      >
        {/* <AddVehicleForm
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setOpenModal(false)}
        /> */}
        {children}
      </CustomModal>
    </>
  );
}
