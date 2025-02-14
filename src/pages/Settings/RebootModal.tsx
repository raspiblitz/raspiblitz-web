import { ConfirmModal } from "@/components/ConfirmModal";
import { AppContext } from "@/context/app-context";
import { instance } from "@/utils/interceptor";
import { useDisclosure } from "@heroui/react";
import { HttpStatusCode } from "axios";
import { type FC, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ActionBox from "./ActionBox";

const confirmEndpoint = "/system/reboot";

const RebootModal: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const { setIsLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const confirmModal = useDisclosure();

  const rebootHandler = async () => {
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
        headline={t("settings.reboot")}
        onConfirm={rebootHandler}
        isLoading={isLoading}
      />

      <ActionBox
        name={t("settings.reboot")}
        actionName={t("settings.reboot")}
        action={() => confirmModal.onOpen()}
        showChild={false}
      />
    </>
  );
};

export default RebootModal;
