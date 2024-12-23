import { Alert } from "@/components/Alert";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import type { LightningChannel } from "@/models/lightning-channel";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Spinner } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ChannelList from "./ChannelList";

const theme = "dark";
export default function ListChannelModal({
  disclosure,
}: Pick<ConfirmModalProps, "disclosure">) {
  const { t } = useTranslation();
  const [openChannels, setOpenChannels] = useState<LightningChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const updateChannel = useCallback(() => {
    setIsLoading(true);
    instance
      .get("lightning/list-channels")
      .then((resp) => {
        setOpenChannels(resp.data);
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    updateChannel();
  }, [updateChannel]);

  const deleteChannelHandler = (channelId: string, forceClose: boolean) => {
    setIsLoading(true);
    instance
      .post(
        "lightning/close-channel",
        {},
        {
          params: {
            channel_id: channelId,
            force_close: forceClose,
          },
        },
      )
      .then(() => {
        toast.success(t("home.channel_closed"), { theme });
        updateChannel();
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <ConfirmModal
      headline={t("home.current_open_channels")}
      disclosure={disclosure}
      custom
    >
      <ConfirmModal.Body>
        {isLoading && <Spinner size="lg" />}

        {!isLoading && openChannels.length === 0 && (
          <Alert color="info">{t("home.no_open_channels")}</Alert>
        )}

        {openChannels.length > 0 && (
          <ChannelList
            channel={openChannels}
            onDelete={deleteChannelHandler}
            isLoading={isLoading}
          />
        )}
        {error && <Alert color="danger">{error}</Alert>}
      </ConfirmModal.Body>
    </ConfirmModal>
  );
}
