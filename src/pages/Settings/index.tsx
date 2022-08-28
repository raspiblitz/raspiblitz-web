import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../components/ConfirmModal";
import useSSE from "../../hooks/use-sse";
import { enableGutter } from "../../utils";
import ActionBox from "./ActionBox";
import ChangePwModal from "./ChangePwModal";
import I18nBox from "./I18nBox";
import VersionBox from "./VersionBox";

const Settings: FC = () => {
  const { t } = useTranslation();
  const [confirmShutdown, setConfirmShutdown] = useState(false);
  const [confirmReboot, setConfirmReboot] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);
  const { systemInfo } = useSSE();

  useEffect(() => {
    enableGutter();
  }, []);

  const showShutdownModalHandler = () => {
    setConfirmShutdown(true);
  };

  const hideShutdownModalHandler = () => {
    setConfirmShutdown(false);
  };

  const showRebootModalHandler = () => {
    setConfirmReboot(true);
  };

  const hideRebootModalHandler = () => {
    setConfirmReboot(false);
  };

  const showPwModalHandler = () => {
    setShowPwModal(true);
  };

  const hidePwModalHandler = () => {
    setShowPwModal(false);
  };

  return (
    <main className="content-container page-container flex flex-col bg-gray-100 transition-colors dark:bg-gray-700 dark:text-white">
      <I18nBox />
      <ActionBox
        name={t("settings.change_pw_a")}
        actionName={t("settings.change")}
        action={showPwModalHandler}
      />
      <ActionBox
        name={t("settings.reboot")}
        actionName={t("settings.reboot")}
        action={showRebootModalHandler}
      />
      <ActionBox
        name={t("settings.shutdown")}
        actionName={t("settings.shutdown")}
        action={showShutdownModalHandler}
      />
      <VersionBox
        platformVersion={systemInfo.platform_version}
        apiVersion={systemInfo.api_version}
      />
      {showPwModal && <ChangePwModal onClose={hidePwModalHandler} />}
      {confirmReboot && (
        <ConfirmModal
          confirmText={t("settings.reboot") + "?"}
          onClose={hideRebootModalHandler}
          confirmEndpoint="/system/reboot"
        />
      )}
      {confirmShutdown && (
        <ConfirmModal
          confirmText={t("settings.shutdown") + "?"}
          onClose={hideShutdownModalHandler}
          confirmEndpoint="/system/shutdown"
        />
      )}
    </main>
  );
};

export default Settings;
