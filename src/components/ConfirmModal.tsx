import { Button } from "@/components/Button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  disclosure: UseDisclosureReturn;
  headline?: string;
  children?: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
} & ({ custom: true } | { custom?: false; body?: ReactNode });

type ConfirmModalComponent = {
  (props: Props): JSX.Element;
  Header: typeof ModalHeader;
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
};

const ConfirmModal: ConfirmModalComponent = ({
  disclosure,
  headline,
  children,
  onConfirm,
  confirmText,
  cancelText,
  isLoading = false,
  ...props
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpenChange, onClose } = disclosure;

  const renderContent = () => {
    if ("custom" in props && props.custom) {
      return children;
    }

    return (
      <>
        {headline && <ModalHeader>{headline}</ModalHeader>}

        <ModalBody>{children || props.body}</ModalBody>

        <ModalFooter>
          <Button onClick={onClose} disabled={isLoading}>
            {cancelText || t("settings.cancel")}
          </Button>
          <Button
            color="primary"
            onClick={onConfirm}
            disabled={isLoading || !onConfirm}
            isLoading={isLoading}
          >
            {confirmText || t("settings.confirm")}
          </Button>
        </ModalFooter>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  );
};

ConfirmModal.Header = ModalHeader;
ConfirmModal.Body = ModalBody;
ConfirmModal.Footer = ModalFooter;

export default ConfirmModal;
