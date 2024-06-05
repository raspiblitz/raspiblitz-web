import { Button } from "@/components/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { useTranslation } from "react-i18next";

export type Props = {
  confirmText: string;
  onConfirm: () => void;
  disclosure: UseDisclosureReturn;
};

export const ConfirmModal = ({ confirmText, onConfirm, disclosure }: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpenChange, onClose } = disclosure;

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("settings.confirm")}
              </ModalHeader>
              <ModalBody>{confirmText}</ModalBody>
              <ModalFooter>
                <Button variant="light" onClick={onClose}>
                  {t("settings.cancel")}
                </Button>
                <Button color="primary" onClick={onConfirm}>
                  {t("settings.confirm")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;
