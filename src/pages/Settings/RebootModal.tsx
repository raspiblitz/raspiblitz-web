import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import { AppContext } from "@/context/app-context";
import ModalDialog from "@/layouts/ModalDialog";
import { MODAL_ROOT } from "@/utils";
import { instance } from "@/utils/interceptor";
import { HttpStatusCode } from "axios";
import { FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export type Props = {
  onClose: () => void;
};

const confirmEndpoint = "/system/reboot";

const RebootModal: FC<Props> = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();

  const rebootHandler = async () => {
    setIsLoading(true);
    const resp = await instance.post(confirmEndpoint);
    if (resp.status === HttpStatusCode.Ok) {
      setIsLoading(false);
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return createPortal(
    <ModalDialog close={onClose}>
      {isLoading && (
        <div className="my-2 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      <p>{t("settings.reboot") + "?"}</p>
      <div className="flex flex-col p-3 xl:flex-row">
        <button
          className="m-2 h-10 w-full rounded bg-gray-500 text-center text-white hover:bg-gray-400 disabled:bg-gray-500 xl:w-1/2"
          onClick={onClose}
          disabled={isLoading}
        >
          {t("settings.cancel")}
        </button>
        <button
          className="m-2 h-10 w-full rounded bg-gray-500 text-center text-white hover:bg-gray-400 disabled:bg-gray-500 xl:w-1/2"
          onClick={rebootHandler}
          disabled={isLoading}
        >
          {t("settings.confirm")}
        </button>
      </div>
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default RebootModal;
