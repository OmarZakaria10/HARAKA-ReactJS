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
      className="z-[10000]"
      theme={{
        root: {
          base: "fixed inset-x-0 top-0 z-[10000] h-screen overflow-y-auto overflow-x-hidden md:inset-0 md:h-full",
          show: {
            on: "flex bg-gray-900/50 dark:bg-gray-900/80",
            off: "hidden",
          },
        },
      }}
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
