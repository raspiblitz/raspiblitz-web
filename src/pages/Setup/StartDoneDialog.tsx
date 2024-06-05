import { Button } from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { useDisclosure } from "@nextui-org/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  setupPhase: SetupPhase;
  callback: (cancel: boolean) => void;
};

const StartDoneDialog: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();
  const confirmModal = useDisclosure();

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
    <>
      <ConfirmModal
        disclosure={confirmModal}
        confirmText={`${t("setup.cancel_setup")}?`}
        onConfirm={() => callback(true)}
      />

      <SetupContainer>
        <Headline>{headline}</Headline>

        <article className="flex flex-col items-center justify-center gap-10 pt-10">
          <Button onClick={() => callback(false)} color="primary">
            {buttonText}
          </Button>
          <Button onClick={() => confirmModal.onOpen()} variant="light">
            {t("setup.cancel")}
          </Button>
        </article>
      </SetupContainer>
    </>
  );
};

export default StartDoneDialog;
