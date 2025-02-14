import type { LightningChannel } from "@/models/lightning-channel";
import { Accordion, AccordionItem } from "@heroui/react";
import type { FC } from "react";
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
        <AccordionItem
          key={c.channel_id}
          aria-label={`Channel: ${c.peer_alias}`}
          title={c.peer_alias}
        >
          <Channel channel={c} isLoading={isLoading} onDelete={onDelete} />
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChannelList;
