import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as CloudDownload } from "../../assets/cloud-download.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-circle.svg";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupMigrationMode, SetupMigrationOS } from "../../models/setup.model";
import ConfirmModal from "../../components/ConfirmModal";

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
        <section className="mx-auto flex w-full flex-col items-center justify-center md:w-3/4">
          <span className="my-5 text-center">
            {t("setup.lightningoutdated")}
          </span>
          <button
            onClick={() => callback(false)}
            className="rounded bg-red-500 p-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
          >
            {t("settings.shutdown")}
          </button>
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
        <section className="flex h-full flex-col items-center justify-center p-8">
          <h2 className="m-2 text-center text-lg font-bold">
            {t(`setup.migrate_${migrationOS}`)}
          </h2>
          <div className="text-center text-sm">{t("setup.convertwarning")}</div>
          <article className="mt-10 flex flex-col items-center justify-center gap-10 md:flex-row">
            <button
              onClick={handleCancel}
              className="rounded  bg-red-500 p-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
            >
              <XCircleIcon className="inline h-7 w-7 align-top" />
              <span className="p-2">{t("setup.no_and_shutdown")}</span>
            </button>
            &nbsp;
            <button
              onClick={() => callback(true)}
              className="bd-button rounded p-2"
            >
              <CloudDownload className="inline h-6 w-6" />
              <span className="p-2">{t("setup.yes_and_migrate")}</span>
            </button>
          </article>
        </section>
      </SetupContainer>
    </>
  );
};

export default MigrationDialog;
