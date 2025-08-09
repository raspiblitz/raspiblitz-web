import { type FC, useEffect } from "react";
import { enableGutter } from "@/utils";
import ChangePwModal from "./ChangePwModal";
import DebugLogBox from "./DebugLogBox";
import I18nBox from "./I18nBox";
import RebootModal from "./RebootModal";
import ShutdownModal from "./ShutdownModal";
import VersionBox from "./VersionBox";

const Settings: FC = () => {
  useEffect(() => {
    enableGutter();
  }, []);

  return (
    <main className="content-container page-container grid auto-rows-min gap-5 bg-gray-700 p-5 pt-8 text-white transition-colors lg:grid-cols-2 lg:gap-8 lg:pb-8 lg:pr-8 lg:pt-8">
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
