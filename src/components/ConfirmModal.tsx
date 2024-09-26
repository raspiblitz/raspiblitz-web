import { Button } from "@/components/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  headline: string;
  body?: ReactNode;
  onConfirm?: () => void;
  disclosure: UseDisclosureReturn;
  isLoading?: boolean;
  customContent?: ReactNode;
};

export const ConfirmModal = ({
  headline,
  body,
  onConfirm,
  disclosure,
  isLoading,
  customContent,
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

              {customContent || (
                <>
                  {!!body && <ModalBody>{body}</ModalBody>}

                  <ModalFooter>
                    <Button
                      variant="light"
                      onClick={onClose}
                      disabled={isLoading}
                    >
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
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmModal;
