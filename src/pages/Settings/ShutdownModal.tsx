import ActionBox from "./ActionBox";
import ConfirmModal from "@/components/ConfirmModal";
import { AppContext } from "@/context/app-context";
import { instance } from "@/utils/interceptor";
import { useDisclosure } from "@nextui-org/react";
import { HttpStatusCode } from "axios";
import { FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

const confirmEndpoint = "/system/shutdown";

const ShutdownModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const confirmModal = useDisclosure();

  const shutdownHandler = async () => {
    setIsLoading(true);
    const resp = await instance.post(confirmEndpoint);
    if (resp.status === HttpStatusCode.Ok) {
      setIsLoading(false);
      setIsLoggedIn(false);
      navigate("/login");
    }
  };

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={t("settings.shutdown_confirm")}
        body={
          <>
            <p className="text-sm">{t("settings.shutdown_info")}</p>
            <p className="text-sm">
              {t("settings.shutdown_info_disconnect_power")}
            </p>
          </>
        }
        onConfirm={shutdownHandler}
        isLoading={isLoading}
      />

      <ActionBox
        name={t("settings.shutdown")}
        actionName={t("settings.shutdown")}
        action={() => confirmModal.onOpen()}
        showChild={false}
      />
    </>
  );
};

export default ShutdownModal;
