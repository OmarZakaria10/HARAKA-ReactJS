import { Button } from "flowbite-react";
import { useRef, useState } from "react";
import CustomModal from "./CustomModal";
import AddVehicleForm from "./AddVehicleForm";

export default function PopUp({
  children,
  title,
  buttonTitle,
  AddModal,
  setAddModal,
}) {
  const firstInputRef = useRef(null);

  return (
    <>
      <Button onClick={() => setAddModal(true)}>{buttonTitle}</Button>
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
