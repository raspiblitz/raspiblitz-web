import { FC, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import ConfirmModal from "../../components/ConfirmModal";
import useSSE from "../../hooks/use-sse";
import { enableGutter } from "../../utils";
import ActionBox from "./ActionBox";
import ChangePwModal from "./ChangePwModal";
import DebugLogBox from "./DebugLogBox";
import I18nBox from "./I18nBox";
import VersionBox from "./VersionBox";
import { instance } from "utils/interceptor";
import { toast } from "react-toastify";

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

  const addAlbyAccountHandler = async () => {
    const resp = await instance.get("/system/connection-info");

    if (
      resp.status !== 200 ||
      !resp.data.lnd_admin_macaroon ||
      !resp.data.lnd_rest_onion
    ) {
      toast.error(t("settings.connection_info_error"));
      return;
    }

    const { lnd_admin_macaroon, lnd_rest_onion } = resp.data;

    if (!window.alby) {
      toast.error(t("settings.alby.connection.hint"));
    }

    try {
      await window.alby.enable();

      const result = await window.alby.addAccount({
        name: "⚡️ Raspiblitz",
        connector: "lnd",
        config: {
          adminkey: lnd_admin_macaroon,
          url: lnd_rest_onion,
        },
      });

      if (result.success) {
        toast.success(t("settings.alby.connection.success"));
      } else {
        toast.error(t("settings.alby.connection.error"));
      }
    } catch (e) {
      toast.error(t("settings.alby.connection.error"));
    }
  };

  return (
    <main className="content-container page-container grid auto-rows-min gap-5 bg-gray-100 p-5 pt-8 transition-colors dark:bg-gray-700 dark:text-white lg:grid-cols-2 lg:gap-8 lg:pb-8 lg:pr-8 lg:pt-8">
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
      <DebugLogBox />
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

      <ActionBox
        name={
          <Trans
            i18nKey={"settings.alby.title"}
            t={t}
            components={[
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                className="underline"
                target="_blank"
                rel="noreferrer"
                href="https://getalby.com"
              ></a>,
            ]}
          />
        }
        actionName={t("settings.alby.label")}
        action={addAlbyAccountHandler}
      />
    </main>
  );
};

export default Settings;
