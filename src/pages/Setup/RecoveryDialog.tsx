import { CloudArrowDownIcon, CogIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../layouts/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export type Props = {
  setupPhase: SetupPhase;
  callback: (start: boolean) => void;
};

const RecoveryDialog: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();

  let headline: string = "";
  switch (setupPhase) {
    case SetupPhase.RECOVERY:
      headline = t("setup.start_recovery");
      break;
    case SetupPhase.UPDATE:
      headline = t("setup.start_update");
      break;
  }

  return (
    <SetupContainer>
      <div className="flex h-full flex-col items-center justify-center">
        <h2 className="text-center text-lg font-bold">{headline}</h2>
        <div className="flex">
          <button
            onClick={() => callback(false)}
            className="m-5 flex items-center rounded px-2 hover:bg-gray-400"
          >
            <CogIcon className="inline h-6 w-6 align-middle" />
            <span className="p-2 align-middle">{t("setup.other_options")}</span>
          </button>
          <button
            onClick={() => callback(true)}
            className="bd-button my-5 flex items-center px-2"
          >
            <CloudArrowDownIcon className="inline h-6 w-6" />
            {/* TODO: Better name would be "Start Recovery or something else instead of just yes */}
            <span className="p-2">{t("setup.yes")}</span>
          </button>
        </div>
      </div>
    </SetupContainer>
  );
};

export default RecoveryDialog;
