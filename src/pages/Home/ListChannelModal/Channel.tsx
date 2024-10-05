import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import { AppContext, Unit } from "@/context/app-context";
import { LightningChannel } from "@/models/lightning-channel";
import { convertSatToBtc, convertToString } from "@/utils/format";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { FC, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  isLoading: boolean;
  showDetails: boolean;
  channel: LightningChannel;
  onClick: (channelId: string) => void;
  onDelete: (channelId: string, forceClose: boolean) => void;
};

const Channel: FC<Props> = ({
  isLoading,
  showDetails,
  channel,
  onClick,
  onDelete,
}) => {
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

  const clickHandler = () => {
    setConfirm(false);
    onClick(channel.channel_id);
  };

  const closeChannelHandler = () => {
    onDelete(channel.channel_id, forceCloseEl.current?.checked || false);
  };

  return (
    <li className="bg-gray-700 p-3 shadow-inner hover:bg-gray-600">
      <div
        className="flex justify-between border-b border-gray-500 pb-2"
        onClick={clickHandler}
      >
        <span>{channel.peer_alias}</span>
        {showDetails && <ChevronUpIcon className="h-6 w-6" />}
        {!showDetails && <ChevronDownIcon className="h-6 w-6" />}
      </div>
      {showDetails && (
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
            <button
              className="bd-button mb-3 p-2"
              disabled={confirm}
              onClick={() => setConfirm(true)}
            >
              {t("home.close_channel")}
            </button>
            {confirm && (
              <div className="flex flex-col justify-center gap-4">
                <span>{t("home.confirm_channel_close")}</span>
                <div className="flex items-center justify-center gap-2">
                  <label htmlFor="forceClose">{t("home.force_close")}</label>
                  <input id="forceClose" type="checkbox" ref={forceCloseEl} />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setConfirm(false)}
                    disabled={isLoading}
                    className="bd-button-red p-2"
                  >
                    {t("setup.cancel")}
                  </button>
                  <ButtonWithSpinner
                    loading={isLoading}
                    className="bd-button p-2"
                    onClick={closeChannelHandler}
                  >
                    {t("setup.yes")}
                  </ButtonWithSpinner>
                </div>
              </div>
            )}
          </article>
        </section>
      )}
    </li>
  );
};

export default Channel;
