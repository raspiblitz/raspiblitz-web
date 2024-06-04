import Channel from "./Channel";
import { LightningChannel } from "@/models/lightning-channel";
import { FC, useState } from "react";

type Props = {
  isLoading: boolean;
  channel: LightningChannel[];
  onDelete: (channelId: string, forceClose: boolean) => void;
};

const ChannelList: FC<Props> = ({ isLoading, channel, onDelete }) => {
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const toggleDetailHandler = (channelId: string) => {
    setShowDetails((prev) => {
      if (prev === channelId) {
        return null;
      }
      return channelId;
    });
  };

  return (
    <ul className="py-8">
      {channel.map((c) => (
        <Channel
          key={c.channel_id}
          channel={c}
          showDetails={c.channel_id === showDetails}
          isLoading={isLoading}
          onClick={toggleDetailHandler}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
};

export default ChannelList;
