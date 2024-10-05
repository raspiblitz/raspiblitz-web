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

export const ConfirmModalHeader = ModalHeader;
export const ConfirmModalBody = ModalBody;
export const ConfirmModalFooter = ModalFooter;

export const ConfirmModal: ConfirmModalComponent = ({
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
        {headline && <ConfirmModalHeader>{headline}</ConfirmModalHeader>}

        <ConfirmModalBody>{children || props.body}</ConfirmModalBody>

        <ConfirmModalFooter>
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
        </ConfirmModalFooter>
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  );
};

ConfirmModal.Header = ConfirmModalHeader;
ConfirmModal.Body = ConfirmModalBody;
ConfirmModal.Footer = ConfirmModalFooter;
