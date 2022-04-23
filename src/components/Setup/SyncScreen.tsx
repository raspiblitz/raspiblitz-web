import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { instance } from "../../util/interceptor";

export interface InputData {
  data: any;
  callback: (action: string, data: any) => void;
}

const SyncScreen: FC<InputData> = ({ data, callback }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [runningUnlock, setRunningUnlock] = useState(false);

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const unlockWallet = async () => {
    setRunningUnlock(true);
    await instance
      .post("/lightning/unlock-wallet", {
        password: password,
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login?back=/setup");
        } else {
          console.log("error on unlock wallet");
          setPassword("");
          setRunningUnlock(false);
        }
      });
    setTimeout(() => {
      setPassword("");
      setRunningUnlock(false);
    }, 30000);
  };

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{t("setup.sync_headline")}</div>
        <br />
        {data.btc_default_ready === "1" && (
          <span>
            <div className="text-center text-sm">
              {t("setup.sync_bitcoin_sync")}: {data.btc_default_sync_percentage}
              % ({data.btc_default_peers} peers)
            </div>
          </span>
        )}
        {data.btc_default_ready !== "1" && (
          <span>
            <div className="text-center text-sm">
              ... {t("setup.sync_bitcoin_starting")} (
              {data.system_count_start_blockchain}) ...
            </div>
          </span>
        )}
        {data.n_default !== "" &&
          data.n_default !== "none" &&
          data.ln_default_locked !== "1" && (
            <span>
              <div className="text-center text-sm">
                Lightning: ready({data.ln_default_ready}) starts(
                {data.system_count_start_lightning})
              </div>
            </span>
          )}
        {data.n_default !== "" &&
          data.n_default !== "none" &&
          data.ln_default_locked !== "0" &&
          !runningUnlock && (
            <div className="justify-center">
              <label htmlFor="passfirst" className="label-underline">
                {t("setup.sync_wallet_info")}
              </label>
              <input
                id="passfirst"
                className="input-underline w-full"
                type="password"
                value={password}
                onChange={changePasswordHandler}
                required
              />
              <button
                onClick={() => unlockWallet()}
                className="bd-button my-5 p-2"
              >
                {t("setup.sync_wallet_unlock")}
              </button>
            </div>
          )}
        {runningUnlock && (
          <div className="justify-center">
            <LoadingSpinner color="text-yellow-500" />
          </div>
        )}
        <button
          onClick={() => callback("shutdown", null)}
          className="bd-button my-5 p-2"
        >
          {t("setup.shutdown")}
        </button>
        <div className="text-center text-sm italic">
          {t("setup.sync_restartinfo")}
        </div>
      </div>
    </SetupContainer>
  );
};

export default SyncScreen;
