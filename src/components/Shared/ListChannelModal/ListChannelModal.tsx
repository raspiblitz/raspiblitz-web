import { FC, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Message from "../../../container/Message/Message";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { LightningChannel } from "../../../models/lightning-channel";
import { AppContext } from "../../../context/app-context";
import { checkError } from "../../../util/checkError";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import ChannelList from "./ChannelList/ChannelList";

type Props = {
  onClose: () => void;
};

const ListChannelModal: FC<Props> = ({ onClose }) => {
  const { darkMode } = useContext(AppContext);
  const { t } = useTranslation();
  const [openChannels, setOpenChannels] = useState<LightningChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = darkMode ? "dark" : "light";

  const updateChannel = useCallback(() => {
    instance
      .get("lightning/list-channels")
      .then((resp) => {
        setOpenChannels(resp.data);
      })
      .catch((err) => {
        setError(checkError(err));
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
        }
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
      {openChannels.length > 0 && (
        <ChannelList
          channel={openChannels}
          onDelete={deleteChannelHandler}
          isLoading={isLoading}
        />
      )}
      {error && <Message message={error} />}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default ListChannelModal;
