import { InformationCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { App } from "../..//models/app.model";
import AppIcon from "../../components/AppIcon";
import { toast } from "react-toastify";
import { instance } from "../../utils/interceptor";

export type Props = {
  appInfo: App;
  onOpenDetails: (app: App) => void;
};

export const AppCard: FC<Props> = ({ appInfo, onOpenDetails }) => {
  const { id, name } = appInfo;
  const { t } = useTranslation();

  const addAlbyAccountHandler = async () => {
    const resp = await instance.get("/system/connection-info");

    if (
      resp.status !== 200 ||
      !resp.data.lnd_admin_macaroon ||
      !resp.data.lnd_rest_onion
    ) {
      toast.error(t(`appInfo.${id}.action.connection_info_error`));
      return;
    }

    const { lnd_admin_macaroon, lnd_rest_onion } = resp.data;

    const albyProvider = window.alby;

    if (!albyProvider) {
      toast.error(t(`appInfo.${id}.action.connection.hint`));
      return;
    }

    try {
      await albyProvider.enable();

      const result = await albyProvider.addAccount({
        name: "⚡️ Raspiblitz",
        connector: "lnd",
        config: {
          adminkey: lnd_admin_macaroon,
          url: lnd_rest_onion,
        },
      });

      if (result.success) {
        toast.success(t(`appInfo.${id}.action.connection.success`));
      } else {
        toast.error(t(`appInfo.${id}.action.connection.error`));
      }
    } catch (e) {
      toast.error(t(`appInfo.${id}.action.connection.error`));
    }
  };

  return (
    <div className="bd-card transition-colors dark:bg-gray-800">
      <div className="relative mt-2 flex h-4/6 w-full flex-row items-center">
        {/* Icon */}
        <div className="mt-4 flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} className="max-h-12" />
        </div>
        {/* Content */}
        <div className="mt-4 flex w-3/4 flex-col items-start justify-center text-xl">
          <h4>{name}</h4>
          <p className="overflow-ellipsis text-base text-gray-500 dark:text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 py-4">
        {window.alby && (
          <button
            className="bd-button flex w-1/2 items-center justify-center p-2 disabled:pointer-events-none"
            onClick={addAlbyAccountHandler}
          >
            <PlusIcon className="inline h-6 w-6" />
            &nbsp;{t(`appInfo.${id}.action.addAccount`)}
          </button>
        )}

        {!window.alby && (
          <a
            className="bd-button flex w-1/2 items-center justify-center p-2 disabled:pointer-events-none"
            target="_blank"
            rel="noreferrer"
            href="https://getalby.com"
          >
            {t(`appInfo.${id}.action.install`)}
          </a>
        )}

        <button
          className="flex w-1/2 items-center justify-center rounded p-2 shadow-md hover:bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-300 dark:hover:text-black"
          onClick={() => onOpenDetails(appInfo)}
        >
          <InformationCircleIcon className="inline h-6 w-6" />
          &nbsp;{t("apps.info")}
        </button>
      </div>
    </div>
  );
};

export default AppCard;
