import { FC, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Message from "../../../components/Message";
import ModalDialog from "../../../layouts/ModalDialog";
import { LightningChannel } from "../../../models/lightning-channel";
import { AppContext } from "../../../context/app-context";
import { checkError } from "../../../utils/checkError";
import { instance } from "../../../utils/interceptor";
import { MODAL_ROOT } from "../../../utils";
import ChannelList from "./ChannelList";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

type Props = {
  onClose: () => void;
};

const ListChannelModal: FC<Props> = ({ onClose }) => {
  const { darkMode } = useContext(AppContext);
  const { t } = useTranslation();
  const [openChannels, setOpenChannels] = useState<LightningChannel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = darkMode ? "dark" : "light";

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

  return createPortal(
    <ModalDialog close={onClose}>
      <h2 className="mb-2 text-lg font-bold">
        {t("home.current_open_channels")}
      </h2>
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
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default ListChannelModal;
