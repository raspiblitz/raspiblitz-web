import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { Checkbox, useDisclosure } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  containsBlockchain: boolean;
  callback: (deleteData: boolean, keepBlockchainData: boolean) => void;
};

export default function FormatDialog({ containsBlockchain, callback }: Props) {
  const { t } = useTranslation();
  const [keepBlockchain, setKeepBlockchain] = useState(containsBlockchain);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    callback(true, keepBlockchain);
  };

  const confirmModal = useDisclosure();

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={`${t("setup.cancel_setup")}?`}
        onConfirm={() => callback(false, false)}
      />

      <SetupContainer currentStep={1}>
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
              onClick={() => confirmModal.onOpen()}
            >
              {t("setup.cancel")}
            </Button>
          </article>
        </form>
      </SetupContainer>
    </>
  );
}
