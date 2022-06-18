import { FC, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { LightningChannel } from "../../../models/lightning-channel";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import ChannelList from "./ChannelList/ChannelList";

type Props = {
  onClose: () => void;
};

const ListChannelModal: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const [openChannels, setOpenChannels] = useState<LightningChannel[]>([]);

  const updateChannel = useCallback(() => {
    instance
      .get("lightning/list-channel")
      .then((resp) => {
        setOpenChannels(resp.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    updateChannel();
  }, [updateChannel]);

  const deleteChannelHandler = (channelId: string, forceClose: boolean) => {
    instance
      .post("lightning/close-channel", {
        channel_id: channelId,
        force_close: forceClose,
      })
      .then((resp) => {
        toast("BLA");
        updateChannel();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return createPortal(
    <ModalDialog close={onClose}>
      <h2 className="mb-2 text-lg font-bold">Current Open Channels</h2>
      <ChannelList channel={openChannels} onDelete={deleteChannelHandler} />
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default ListChannelModal;
