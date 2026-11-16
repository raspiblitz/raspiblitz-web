import { Modal, useOverlayState } from "@heroui/react";
import { type FC, type PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";

type Props = { closeable?: boolean; close: () => void; label: string };

const ModalDialog: FC<PropsWithChildren<Props>> = ({
  closeable = true,
  close,
  label,
  children,
}) => {
  const { t } = useTranslation();
  const state = useOverlayState({
    isOpen: true,
    onOpenChange: (open) => {
      if (!open && closeable) close();
    },
  });
  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable={false} isKeyboardDismissDisabled={!closeable}>
        <Modal.Container size="lg" scroll="inside" className="p-0 sm:p-0 md:p-4">
          <Modal.Dialog
            aria-label={label}
            className="h-dvh max-h-dvh max-w-none rounded-none bg-gray-800 text-white md:h-auto md:max-h-[90dvh] md:max-w-lg md:rounded-lg"
          >
            {closeable && (
              <div className="flex justify-end">
                <Modal.CloseTrigger
                  aria-label={t("common.close")}
                  className="static min-h-11 min-w-11"
                />
              </div>
            )}
            <Modal.Body>{children}</Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
export default ModalDialog;
