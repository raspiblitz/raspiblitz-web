import { PlusIcon, LinkIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import AppIcon from "@/components/AppIcon";
import { toast } from "react-toastify";
import { instance } from "@/utils/interceptor";

export const AppCardAlby: FC = () => {
  const { id, name } = {
    id: "alby",
    name: "Alby",
  };

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
      <div className="flex flex-row justify-center gap-2 py-4">
        {window.alby && (
          <button
            className="bd-button flex w-1/2 items-center justify-center p-2 disabled:pointer-events-none"
            onClick={addAlbyAccountHandler}
          >
            <LinkIcon className="inline h-6 w-6" />
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
            <PlusIcon className="inline h-6 w-6" />
            {t(`appInfo.${id}.action.install`)}
          </a>
        )}
      </div>
    </div>
  );
};

export default AppCardAlby;
