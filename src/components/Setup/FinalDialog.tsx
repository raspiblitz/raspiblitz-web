import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export type Props = {
  setupPhase: SetupPhase;
  seedWords: string;
  callback: () => void;
};

const FinalDialog: FC<Props> = ({ setupPhase, seedWords, callback }) => {
  const { t } = useTranslation();

  let headline: string;
  switch (setupPhase) {
    case SetupPhase.RECOVERY:
      headline = t("setup.final_recovery");
      break;
    case SetupPhase.UPDATE:
      headline = t("setup.final_update");
      break;
    case SetupPhase.MIGRATION:
      headline = t("setup.final_migration");
      break;
    default:
      headline = t("setup.final_setup");
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{headline}</div>
        <br />
        {seedWords && (
          <div className="text-center">
            <div className="text-sm">{t("setup.final_seedwords")}</div>
            <div className="text-sm italic">{seedWords}</div>
          </div>
        )}
        <br />
        <div className="text-center text-sm">
          {t("setup.final_info_reboot")}
        </div>
        <button onClick={() => callback()} className="bd-button my-5 p-2">
          {t("setup.final_do_reboot")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default FinalDialog;
