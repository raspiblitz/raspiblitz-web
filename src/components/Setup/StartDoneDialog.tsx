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

  let headline: string;
  let buttonText: string;

  switch (setupPhase) {
    case SetupPhase.RECOVERY:
      headline = t("setup.done_recover_ready");
      buttonText = t("setup.done_recover_start");
      break;
    case SetupPhase.UPDATE:
      headline = t("setup.done_update_ready");
      buttonText = t("setup.done_update_start");
      break;
    case SetupPhase.MIGRATION:
      headline = t("setup.done_migration_ready");
      buttonText = t("setup.done_migration_start");
      break;
    default:
      headline = t("setup.done_setup_ready");
      buttonText = t("setup.done_setup_start");
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
