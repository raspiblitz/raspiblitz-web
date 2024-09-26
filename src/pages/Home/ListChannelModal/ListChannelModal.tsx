import ChannelList from "./ChannelList";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";
import Message from "@/components/Message";
import { LightningChannel } from "@/models/lightning-channel";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { ModalBody } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

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
      customContent={
        <ModalBody>
          {isLoading && (
            <div className="my-2 flex justify-center">
              <LoadingSpinner />
            </div>
          )}
          {!isLoading && openChannels.length === 0 && (
            <p>{t("home.no_open_channels")}</p>
          )}
          {openChannels.length > 0 && (
            <ChannelList
              channel={openChannels}
              onDelete={deleteChannelHandler}
              isLoading={isLoading}
            />
          )}
          {error && <Message message={error} />}
        </ModalBody>
      }
      disclosure={disclosure}
    />
  );
}
