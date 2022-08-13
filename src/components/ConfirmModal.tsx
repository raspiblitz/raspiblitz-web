import { FC, useContext } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ModalDialog from "../layouts/ModalDialog";
import { AppContext } from "../context/app-context";
import { instance } from "../util/interceptor";
import { MODAL_ROOT } from "../util";

export type Props = {
  confirmText: string;
  confirmEndpoint?: string; // TODO #345 remove
  onConfirm?: () => void;
  onClose: () => void;
};

const btnClasses =
  "w-full xl:w-1/2 text-center h-10 m-2 bg-yellow-500 hover:bg-yellow-400 rounded text-white";

const ConfirmModal: FC<Props> = ({
  confirmText,
  confirmEndpoint,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const shutdownHandler = async () => {
    if (confirmEndpoint) {
      const resp = await instance.post(confirmEndpoint);
      if (resp.status === 200) {
        setIsLoggedIn(false);
        navigate("/login");
      }
    }
  };

  return createPortal(
    <ModalDialog close={onClose}>
      {confirmText}
      <div className="flex flex-col p-3 xl:flex-row">
        <button className={btnClasses} onClick={onClose}>
          {t("settings.cancel")}
        </button>
        {onConfirm && (
          <button className={btnClasses} onClick={onConfirm}>
            {t("settings.confirm")}
          </button>
        )}
        {!onConfirm && (
          <button className={btnClasses} onClick={shutdownHandler}>
            {t("settings.confirm")}
          </button>
        )}
      </div>
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default ConfirmModal;
