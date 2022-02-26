import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChangePwModal from "../components/Settings/ChangePwModal/ChangePwModal";
import I18nBox from "../components/Settings/I18nBox/I18nBox";
import ConfirmModal from "../components/Shared/ConfirmModal/ConfirmModal";
import ActionBox from "../container/ActionBox/ActionBox";
import { enableGutter } from "../util/util";

const Settings: FC = () => {
  const { t } = useTranslation();
  const [confirmShutdown, setConfirmShutdown] = useState(false);
  const [confirmReboot, setConfirmReboot] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

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
        name={t("settings.change_pw")}
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
