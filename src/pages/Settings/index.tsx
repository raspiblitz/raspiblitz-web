import { enableGutter } from "@/utils";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ActionBox from "./ActionBox";
import ChangePwModal from "./ChangePwModal";
import DebugLogBox from "./DebugLogBox";
import I18nBox from "./I18nBox";
import RebootModal from "./RebootModal";
import ShutdownModal from "./ShutdownModal";
import VersionBox from "./VersionBox";

/**
 * Displays the settings page.
 */
const Settings: FC = () => {
  const { t } = useTranslation();
  const [showShutdownModal, setShowShutdownModal] = useState(false);
  const [showRebootModal, setShowRebootModal] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  useEffect(() => {
    enableGutter();
  }, []);

  return (
    <main className="content-container page-container grid auto-rows-min gap-5 bg-gray-100 p-5 pt-8 transition-colors dark:bg-gray-700 dark:text-white lg:grid-cols-2 lg:gap-8 lg:pb-8 lg:pr-8 lg:pt-8">
      <I18nBox />
      <ActionBox
        name={t("settings.change_pw_a")}
        actionName={t("settings.change")}
        action={() => setShowPwModal(true)}
        showChild={showPwModal}
      >
        <ChangePwModal onClose={() => setShowPwModal(false)} />
      </ActionBox>
      <ActionBox
        name={t("settings.reboot")}
        actionName={t("settings.reboot")}
        action={() => setShowRebootModal(true)}
        showChild={showRebootModal}
      >
        <RebootModal onClose={() => setShowRebootModal(false)} />
      </ActionBox>
      <ActionBox
        name={t("settings.shutdown")}
        actionName={t("settings.shutdown")}
        action={() => setShowShutdownModal(true)}
        showChild={showShutdownModal}
      >
        <ShutdownModal onClose={() => setShowShutdownModal(false)} />
      </ActionBox>
      <VersionBox />
      <DebugLogBox />
    </main>
  );
};

export default Settings;
