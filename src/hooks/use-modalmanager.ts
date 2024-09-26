import { useDisclosure } from "@nextui-org/use-disclosure";
import { useState } from "react";

// make this enum or object tyoe enum?
export type ModalType =
  | "SEND"
  | "RECEIVE"
  | "DETAIL"
  | "OPEN_CHANNEL"
  | "LIST_CHANNEL"
  | "UNLOCK"
  | null;

export function useModalManager() {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const disclosure = useDisclosure();

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
    disclosure.onOpen();
  };

  const closeModal = () => {
    setActiveModal(null);
    disclosure.onClose();
  };

  return {
    activeModal,
    disclosure,
    openModal,
    closeModal,
  };
}
