import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils";
import { FC } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

export type Props = {
  confirmText: string;
  onConfirm: () => void;
  onClose: () => void;
};

const btnClasses =
  "w-full xl:w-1/2 text-center h-10 m-2 bg-yellow-500 hover:bg-yellow-400 rounded text-white";

const ConfirmModal: FC<Props> = ({ confirmText, onConfirm, onClose }) => {
  const { t } = useTranslation();

  return createPortal(
    <ModalDialog close={onClose}>
      {confirmText}
      <div className="flex flex-col p-3 xl:flex-row">
        <button className={btnClasses} onClick={onClose}>
          {t("settings.cancel")}
        </button>
        <button className={btnClasses} onClick={onConfirm}>
          {t("settings.confirm")}
        </button>
      </div>
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default ConfirmModal;
