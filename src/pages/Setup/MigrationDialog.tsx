import { CloudArrowDownIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupMigrationMode, SetupMigrationOS } from "@/models/setup.model";
import { Alert } from "@/components/Alert";
import { Button } from "@nextui-org/react";

export interface InputData {
  migrationOS: SetupMigrationOS;
  migrationMode: SetupMigrationMode;
  callback: (migrate: boolean) => void;
}

const MigrationDialog: FC<InputData> = ({
  migrationOS,
  migrationMode,
  callback,
}) => {
  const { t } = useTranslation();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const hideConfirm = () => {
    setShowConfirmModal(false);
  };

  if (migrationMode === SetupMigrationMode.OUTDATED) {
    return (
      <SetupContainer>
        <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-y-8">
          <Alert as="h4">{t("setup.lightningoutdated")}</Alert>

          <Button
            type="button"
            onClick={() => callback(false)}
            color="primary"
            className="rounded-full px-8 py-6 font-semibold"
          >
            {t("settings.shutdown")}
          </Button>
        </section>
      </SetupContainer>
    );
  }

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          confirmText={`${t("setup.cancel_setup")}?`}
          onClose={hideConfirm}
          onConfirm={() => callback(false)}
        />
      )}

      <SetupContainer>
        <section className="flex h-full max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
          <h2 className="text-center text-2xl font-semibold">
            {t(`setup.migrate_to_os`, {
              os: `${migrationOS[0].toUpperCase()}${migrationOS.slice(1)}`,
            })}
          </h2>

          <p className="text-center text-base">{t("setup.convertwarning")}</p>

          <article className="flex flex-col items-center justify-center gap-10">
            <Button
              type="button"
              onClick={handleCancel}
              color="primary"
              className="rounded-full px-8 py-6 font-semibold"
            >
              {t("setup.no_and_shutdown")}
            </Button>
            <Button
              type="button"
              color="secondary"
              variant="light"
              onClick={() => callback(true)}
            >
              {t("setup.yes_and_migrate")}
            </Button>
          </article>
        </section>
      </SetupContainer>
    </>
  );
};

export default MigrationDialog;
