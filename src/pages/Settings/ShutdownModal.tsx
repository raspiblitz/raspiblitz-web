import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { AppContext } from "@/context/app-context";
import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils/index";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export type Props = {
  onClose: () => void;
};

const confirmEndpoint = "/system/shutdown";

const ShutdownModal: FC<Props> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const shutdownHandler = async () => {
    setIsLoading(true);
    const resp = await instance.post(confirmEndpoint);
    if (resp.status === HttpStatusCode.Ok) {
      setIsLoading(false);
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return createPortal(
    <ModalDialog close={onClose} closeable={!isLoading}>
      {isLoading && (
        <div className="my-2 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      {t("settings.shutdown_confirm")}
      <div>
        <p className="pt-4 text-center text-sm">
          {t("settings.shutdown_info")}
        </p>
        <p className="pt-4 text-center text-sm">
          {t("settings.shutdown_info_disconnect_power")}
        </p>
      </div>
      <div className="flex flex-col p-3 xl:flex-row">
        <button
          className="m-2 h-10 w-full rounded bg-gray-500 text-center text-white hover:bg-gray-400 disabled:bg-gray-500 xl:w-1/2"
          onClick={onClose}
          disabled={isLoading}
        >
          {t("settings.cancel")}
        </button>
        <button
          className="m-2 h-10 w-full rounded bg-yellow-500 text-center text-white hover:bg-yellow-400 disabled:bg-gray-500 xl:w-1/2"
          onClick={shutdownHandler}
          disabled={isLoading}
        >
          {t("settings.confirm")}
        </button>
      </div>
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default ShutdownModal;
