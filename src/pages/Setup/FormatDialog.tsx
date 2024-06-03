import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";
import { Button, Checkbox } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

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
          <h1 className="m-2 text-center text-3xl font-bold">
            {t("setup.format.delete_drive")}
          </h1>
          <article className="mt-2 rounded-xl border border-warning-500 bg-warning-500/5 p-4 font-semibold text-warning-500">
            {t("setup.format.warn")}
          </article>
          {containsBlockchain && (
            <Checkbox
              id="keepBlockchain"
              onValueChange={setKeepBlockchain}
              isSelected={keepBlockchain}
            >
              {t("setup.format.keep_blockchain")}
            </Checkbox>
          )}
          <article className="flex flex-col items-center justify-center gap-10">
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
