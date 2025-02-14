import AppIcon from "@/components/AppIcon";
import { instance } from "@/utils/interceptor";
import {
  ArrowTopRightOnSquareIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { Button, Link } from "@heroui/react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
        toast.success(t(`appInfo.${id}.action.connection.success`), {
          theme: "dark",
        });
      } else {
        toast.error(t(`appInfo.${id}.action.connection.error`), {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(t(`appInfo.${id}.action.connection.error`), {
        theme: "dark",
      });
    }
  };

  return (
    <article className="bd-card bg-gray-800 transition-colors">
      <div className="relative mt-2 flex h-4/6 w-full flex-row items-center">
        {/* Icon */}
        <div className="mt-4 flex w-1/4 items-center justify-center p-2">
          <AppIcon appId={id} className="max-h-12" />
        </div>

        {/* Content */}
        <div className="mt-4 flex w-3/4 flex-col items-start justify-center text-xl">
          <h4>{name}</h4>
          <p className="overflow-ellipsis text-base text-gray-200">
            {t(`appInfo.${id}.shortDescription`)}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-2 py-4">
        {window.alby && (
          <Button
            onPress={addAlbyAccountHandler}
            color="primary"
            startContent={<LinkIcon className="inline h-6 w-6" />}
          >
            {t(`appInfo.${id}.action.addAccount`)}
          </Button>
        )}

        {!window.alby && (
          <Button
            as={Link}
            target="_blank"
            rel="noreferrer"
            href="https://getalby.com"
            color="primary"
            startContent={
              <ArrowTopRightOnSquareIcon className="inline h-6 w-6" />
            }
          >
            {t(`appInfo.${id}.action.install`)}
          </Button>
        )}
      </div>
    </article>
  );
};

export default AppCardAlby;
