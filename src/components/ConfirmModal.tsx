import { Modal, type useOverlayState } from "@heroui/react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";

export type Props = {
  disclosure: ReturnType<typeof useOverlayState>;
  headline?: string;
  children?: ReactNode;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
} & ({ custom: true } | { custom?: false; body?: ReactNode });

type ConfirmModalComponent = {
  (props: Props): React.JSX.Element;
  Header: typeof Modal.Header;
  Body: typeof Modal.Body;
  Footer: typeof Modal.Footer;
};

export const ConfirmModalHeader = Modal.Header;
export const ConfirmModalBody = Modal.Body;
export const ConfirmModalFooter = Modal.Footer;

export const ConfirmModal: ConfirmModalComponent = ({
  disclosure,
  headline,
  children,
  onConfirm,
  confirmText,
  cancelText,
  isLoading = false,
  ...props
}: Props) => {
  const { t } = useTranslation();

  if ("custom" in props && props.custom) {
    return (
      <Modal state={disclosure}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog>{children}</Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    );
  }

  return (
    <Modal state={disclosure}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            {headline && (
              <Modal.Header>
                <Modal.Heading>{headline}</Modal.Heading>
              </Modal.Header>
            )}

            <Modal.Body>{children || props.body}</Modal.Body>

            <Modal.Footer>
              <Button onPress={() => disclosure.close()} isDisabled={isLoading}>
                {cancelText || t("settings.cancel")}
              </Button>
              <Button
                variant="primary"
                onPress={onConfirm}
                isDisabled={isLoading || !onConfirm}
                isPending={isLoading}
              >
                {confirmText || t("settings.confirm")}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

ConfirmModal.Header = ConfirmModalHeader;
ConfirmModal.Body = ConfirmModalBody;
ConfirmModal.Footer = ConfirmModalFooter;
