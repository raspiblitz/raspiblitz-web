import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";
import { ReactComponent as ArrowRight } from "../../assets/arrow-sm-right.svg";
import { ReactComponent as X } from "../../assets/X.svg";

export type Props = {
  setupPhase: SetupPhase;
  callback: (cancel: boolean) => void;
};

const StartDoneDialog: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();

  let headline: string = t("setup.done_setup_ready");
  let buttonText: string = t("setup.done_setup_start");
  if (setupPhase === SetupPhase.RECOVERY) {
    headline = t("setup.done_recover_ready");
    buttonText = t("setup.done_recover_start");
  }
  if (setupPhase === SetupPhase.UPDATE) {
    headline = t("setup.done_update_ready");
    buttonText = t("setup.done_update_start");
  }
  if (setupPhase === SetupPhase.MIGRATION) {
    headline = t("setup.done_migration_ready");
    buttonText = t("setup.done_migration_start");
  }

  return (
    <SetupContainer>
      <h2 className="text-center text-lg font-bold">{headline}</h2>
      <div className="mt-5 flex justify-center gap-2">
        <button
          onClick={() => callback(true)}
          className="flex items-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
        >
          <X className="inline h-6 w-6" />
          <span className="p-2">{t("setup.cancel")}</span>
        </button>
        <button
          onClick={() => callback(false)}
          className="bd-button flex items-center px-2"
        >
          <span className="p-2 ">{buttonText}</span>
          <ArrowRight className="inline h-6 w-6" />
        </button>
      </div>
    </SetupContainer>
  );
};

export default StartDoneDialog;
