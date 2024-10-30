import { AppContext, Unit } from "@/context/app-context";
import { LightningChannel } from "@/models/lightning-channel";
import { convertSatToBtc, convertToString } from "@/utils/format";
import { Button } from "@nextui-org/react";
import { FC, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isLoading: boolean;
  channel: LightningChannel;
  onDelete: (channelId: string, forceClose: boolean) => void;
};

const Channel: FC<Props> = ({ isLoading, channel, onDelete }) => {
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();
  const [confirm, setConfirm] = useState(false);
  const forceCloseEl = useRef<HTMLInputElement>(null);

  const convertedLocal =
    unit === Unit.SAT
      ? convertToString(unit, channel.balance_local)
      : convertSatToBtc(channel.balance_local);
  const convertedRemote =
    unit === Unit.SAT
      ? convertToString(unit, channel.balance_remote)
      : convertSatToBtc(channel.balance_remote);

  const closeChannelHandler = () => {
    onDelete(channel.channel_id, forceCloseEl.current?.checked || false);
  };

  return (
    <section className="flex flex-col gap-4 py-4">
      <article className="flex flex-col items-center justify-center md:flex-row md:justify-around">
        <div className="mb-1 flex w-full flex-col justify-center md:w-1/2 md:justify-around">
          <h4 className="mb-1 font-bold">{t("home.channel_id")}</h4>
          <p className="mx-2 overflow-x-auto">{channel.channel_id}</p>
        </div>
        <div className="mb-1 flex w-full flex-col justify-center md:w-1/2 md:justify-around">
          <h4 className="mb-1 font-bold">{t("home.active")}</h4>
          <p className="mx-2 overflow-x-auto">
            {channel.active ? t("setup.yes") : t("home.no")}
          </p>
        </div>
      </article>
      <article className="flex flex-col items-center justify-center md:flex-row md:justify-around">
        <div className="mb-1 flex w-full flex-col justify-center md:w-1/2 md:justify-around">
          <h4 className="mb-1 font-bold">{t("home.local_balance")}</h4>
          <p className="mx-2 overflow-x-auto">
            {convertedLocal} {unit}
          </p>
        </div>
        <div className="mb-1 flex w-full flex-col justify-center md:w-1/2 md:justify-around">
          <h4 className="mb-1 font-bold">{t("home.remote_balance")}</h4>
          <p className="mx-2 overflow-x-auto">
            {convertedRemote} {unit}
          </p>
        </div>
      </article>

      <article>
        <Button
          color="primary"
          isDisabled={confirm}
          onClick={() => setConfirm(true)}
        >
          {t("home.close_channel")}
        </Button>

        {/*TODO should be confirm modal*/}
        {confirm && (
          <div className="flex flex-col justify-center gap-4">
            <span>{t("home.confirm_channel_close")}</span>

            <div className="flex items-center justify-center gap-2">
              <label htmlFor="forceClose">{t("home.force_close")}</label>
              <input id="forceClose" type="checkbox" ref={forceCloseEl} />
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={() => setConfirm(false)} isDisabled={isLoading}>
                {t("setup.cancel")}
              </Button>
              <Button
                color="primary"
                isLoading={isLoading}
                onClick={closeChannelHandler}
              >
                {t("setup.yes")}
              </Button>
            </div>
          </div>
        )}
      </article>
    </section>
  );
};

export default Channel;
