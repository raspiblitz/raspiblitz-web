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
  headline: string;
  body?: string;
  onConfirm: () => void;
  disclosure: UseDisclosureReturn;
  isLoading?: boolean;
};

export const ConfirmModal = ({
  headline,
  body,
  onConfirm,
  disclosure,
  isLoading,
}: Props) => {
  const { t } = useTranslation();
  const { isOpen, onOpenChange, onClose } = disclosure;

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {headline}
              </ModalHeader>

              {!!body && <ModalBody>{body}</ModalBody>}

              <ModalFooter>
                <Button variant="light" onClick={onClose} disabled={isLoading}>
                  {t("settings.cancel")}
                </Button>
                <Button
                  color="primary"
                  onClick={onConfirm}
                  disabled={isLoading}
                  isLoading={isLoading}
                >
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
