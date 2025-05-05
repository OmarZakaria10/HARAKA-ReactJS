"use client";

import Button from "./Button";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";

export default function PopUp({
  children,
  openModal,
  setOpenModal,
  firstInputRef,
}) {
  return (
    <>
      <Button onClick={() => setOpenModal(true)}>إضافة</Button>
      <Modal
        show={openModal}
        size="4xl"
        popup
        onClose={() => setOpenModal(false)}
        initialFocus={firstInputRef}
      >
        <ModalHeader />
        <ModalBody dir="rtl">
          <div className="space-y-6">{children}</div>
        </ModalBody>
      </Modal>
    </>
  );
}
