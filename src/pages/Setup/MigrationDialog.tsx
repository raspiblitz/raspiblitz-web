import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupMigrationMode, SetupMigrationOS } from "@/models/setup.model";
import { useDisclosure } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

type Props = {
  migrationOS: SetupMigrationOS;
  migrationMode: SetupMigrationMode;
  callback: (migrate: boolean) => void;
};

export default function MigrationDialog({
  migrationOS,
  migrationMode,
  callback,
}: Props) {
  const { t } = useTranslation();
  const confirmModal = useDisclosure();

  if (migrationMode === SetupMigrationMode.OUTDATED) {
    return (
      <SetupContainer currentStep={1}>
        <section className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-y-8">
          <Alert color="warning" as="h4">
            {t("setup.lightningoutdated")}
          </Alert>

          <Button type="button" onClick={() => callback(false)} color="primary">
            {t("settings.shutdown")}
          </Button>
        </section>
      </SetupContainer>
    );
  }

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={`${t("setup.cancel_setup")}?`}
        onConfirm={() => callback(false)}
      />

      <SetupContainer currentStep={1}>
        <section className="flex h-full max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
          <div>
            <Headline>
              {t(`setup.migrate_to_os`, {
                os: `${migrationOS[0].toUpperCase()}${migrationOS.slice(1)}`,
              })}
            </Headline>

            <p className="m-2 text-center text-secondary">
              {t("setup.convertwarning")}
            </p>
          </div>

          <article className="flex flex-col items-center justify-center gap-10 pt-10">
            <Button
              type="button"
              onClick={() => confirmModal.onOpen()}
              color="primary"
            >
              {t("setup.no_and_shutdown")}
            </Button>
            <Button
              type="button"
              color="secondary"
              onClick={() => callback(true)}
            >
              {t("setup.yes_and_migrate")}
            </Button>
          </article>
        </section>
      </SetupContainer>
    </>
  );
}
