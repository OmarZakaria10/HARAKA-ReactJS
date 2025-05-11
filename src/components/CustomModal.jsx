import { Modal, ModalBody, ModalHeader } from "flowbite-react";

export default function CustomModal({
  isOpen,
  onClose,
  children,
  initialFocus,
  title,
}) {
  return (
    <Modal
      show={isOpen}
      size="4xl"
      popup
      onClose={onClose}
      initialFocus={initialFocus}
    >
      <ModalHeader />
      <ModalBody dir="rtl">
        <div className="space-y-6">
          {title && (
            <h3 className="text-xl font-medium text-gray-900 dark:text-white text-right">
              {title}
            </h3>
          )}
          {children}
        </div>
      </ModalBody>
    </Modal>
  );
}
