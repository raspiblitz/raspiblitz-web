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
      headline = "Recovery is finished.";
      break;
    case SetupPhase.UPDATE:
      headline = "Update is finished.";
      break;
    case SetupPhase.MIGRATION:
      headline = "Migration is finished.";
      break;
    default:
      headline = "Setup is finished.";
  }

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{headline}</div>
        <br />
        {seedWords && (
          <div className="text-center">
            <div className="text-sm">
              Please write down your seed words &amp; store at a safe place:
            </div>
            <div className="text-sm italic">{seedWords}</div>
          </div>
        )}
        <br />
        <div className="text-center text-sm">
          Will now reboot and sync up the blockchain.
        </div>
        <button onClick={() => callback()} className="bd-button my-5 p-2">
          OK, do final Reboot
        </button>
      </div>
    </SetupContainer>
  );
};

export default FinalDialog;
