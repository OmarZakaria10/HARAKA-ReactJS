import { Button } from "flowbite-react";
import { useRef, useState } from "react";
import CustomModal from "./CustomModal";
import VehicleForm from "./VehicleForm";

export default function PopUp({ setRowData }) {
  const [openModal, setOpenModal] = useState(false);
  const firstInputRef = useRef(null);

  const handleSubmitSuccess = (newVehicle) => {
    setRowData((prevRowData) => [...prevRowData, newVehicle]);
    setOpenModal(false);
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)}>إضافة</Button>
      <CustomModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        initialFocus={firstInputRef}
        title="إضافة مركبة جديدة"
      >
        <VehicleForm
          onSubmitSuccess={handleSubmitSuccess}
          onCancel={() => setOpenModal(false)}
        />
      </CustomModal>
    </>
  );
}