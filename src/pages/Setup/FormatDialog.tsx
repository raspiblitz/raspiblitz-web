import { Button } from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";
import { Checkbox } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { Headline } from "@/components/Headline";
import { Alert } from "@/components/Alert";

export type Props = {
  containsBlockchain: boolean;
  callback: (deleteData: boolean, keepBlockchainData: boolean) => void;
};

export default function FormatDialog({ containsBlockchain, callback }: Props) {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [keepBlockchain, setKeepBlockchain] = useState(containsBlockchain);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    callback(true, keepBlockchain);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          confirmText={`${t("setup.cancel_setup")}?`}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={() => callback(false, false)}
        />
      )}
      <SetupContainer>
        <form
          className="flex h-full flex-col items-center justify-center gap-8 p-8"
          onSubmit={submitHandler}
        >
          <Headline>{t("setup.format.delete_drive")}</Headline>
          <Alert color="warning">{t("setup.format.warn")}</Alert>

          {containsBlockchain && (
            <Checkbox
              id="keepBlockchain"
              onValueChange={setKeepBlockchain}
              isSelected={keepBlockchain}
            >
              {t("setup.format.keep_blockchain")}
            </Checkbox>
          )}

          <article className="flex flex-col items-center justify-center gap-10 pt-10">
            <Button type="submit" color="primary">
              {t("setup.format.delete_confirm")}
            </Button>

            <Button
              type="button"
              color="danger"
              variant="light"
              onClick={() => setShowConfirmModal(true)}
            >
              {t("setup.cancel")}
            </Button>
          </article>
        </form>
      </SetupContainer>
    </>
  );
}
