import { Accordion } from "@heroui/react";
import type { FC } from "react";
import type { LightningChannel } from "@/models/lightning-channel";
import Channel from "./Channel";

type Props = {
  isLoading: boolean;
  channel: LightningChannel[];
  onDelete: (channelId: string, forceClose: boolean) => void;
};

const ChannelList: FC<Props> = ({ isLoading, channel, onDelete }) => {
  return (
    <Accordion>
      {channel.map((c) => (
        <Accordion.Item key={c.channel_id} id={c.channel_id}>
          <Accordion.Heading>
            <Accordion.Trigger>{c.peer_alias}</Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Channel channel={c} isLoading={isLoading} onDelete={onDelete} />
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default ChannelList;
