import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  setupPhase: SetupPhase;
  callback: (cancel: boolean) => void;
};

const StartDoneDialog: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const hideConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          confirmText={`${t("setup.cancel_setup")}?`}
          onClose={hideConfirm}
          onConfirm={() => callback(true)}
        />
      )}
      <SetupContainer>
        <h2 className="text-center text-lg font-bold">{headline}</h2>
        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={handleCancel}
            className="flex items-center rounded bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
          >
            <XMarkIcon className="inline h-6 w-6" />
            <span className="p-2">{t("setup.cancel")}</span>
          </button>
          <button
            onClick={() => callback(false)}
            className="bd-button flex items-center px-2"
          >
            <span className="p-2 ">{buttonText}</span>
            <ArrowSmallRightIcon className="inline h-6 w-6" />
          </button>
        </div>
      </SetupContainer>
    </>
  );
};

export default StartDoneDialog;
