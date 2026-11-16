import { XMarkIcon } from "@heroicons/react/24/outline";
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
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog aria-label={label} className="max-h-[90dvh] bg-gray-800 text-white">
            {closeable && (
              <div className="flex justify-end">
                <button
                  type="button"
                  aria-label={t("common.close")}
                  onClick={close}
                  className="flex min-h-11 min-w-11 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
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
