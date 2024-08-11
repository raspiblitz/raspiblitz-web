import ChangePwModal from "./ChangePwModal";
import DebugLogBox from "./DebugLogBox";
import I18nBox from "./I18nBox";
import RebootModal from "./RebootModal";
import ShutdownModal from "./ShutdownModal";
import VersionBox from "./VersionBox";
import { enableGutter } from "@/utils";
import { FC, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Settings: FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    enableGutter();
  }, []);

  return (
    <main className="content-container page-container grid auto-rows-min gap-5 p-5 pt-8 transition-colors bg-gray-700 text-white lg:grid-cols-2 lg:gap-8 lg:pb-8 lg:pr-8 lg:pt-8">
      <I18nBox />
      <ChangePwModal />
      <RebootModal />
      <ShutdownModal />
      <VersionBox />
      <DebugLogBox />
    </main>
  );
};

export default Settings;
