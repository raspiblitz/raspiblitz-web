import { useOverlayState } from "@heroui/react";
import { useState } from "react";

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
  const disclosure = useOverlayState();

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
    disclosure.open();
  };

  const closeModal = () => {
    setActiveModal(null);
    disclosure.close();
  };

  return {
    activeModal,
    disclosure,
    openModal,
    closeModal,
  };
}
