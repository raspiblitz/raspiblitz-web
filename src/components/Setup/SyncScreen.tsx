import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import ProgressCircle from "../../container/ProgressCircle/ProgressCircle";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { instance } from "../../util/interceptor";

export interface InputData {
  data: SyncData | any;
  callback: (action: string, data: any) => void;
}

interface SyncData {
  initialsync: string;
  btc_default: string;
  btc_default_ready: string;
  btc_default_sync_percentage: string;
  btc_default_peers: string;
  system_count_start_blockchain: string;
  ln_default: string;
  ln_default_ready: string;
  ln_default_locked: string;
  system_count_start_lightning: string;
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
    // TODO: Why setRunningUnlock always after 30s?
    setTimeout(() => {
      setPassword("");
      setRunningUnlock(false);
    }, 30000);
  };

  return (
    <SetupContainer>
      <section className="flex h-full flex-col items-center justify-center md:p-8">
        <h2 className="text-center text-lg font-bold">
          {t("setup.sync_headline")}
        </h2>
        <div className="flex h-full w-full flex-col py-1 md:w-10/12">
          <div className="my-auto flex flex-col items-center justify-between md:flex-row">
            <div className="my-8 flex w-full justify-center md:my-0 md:w-1/2">
              <ProgressCircle
                progress={57}
                starting={data.btc_default_ready !== "1"}
              />
            </div>
            <div className="flex w-full flex-col justify-center md:w-1/2">
              {data.ln_default &&
                data.ln_default !== "none" &&
                data.ln_default_locked !== "1" && (
                  <article>
                    <h6 className="text-sm text-gray-500 dark:text-gray-300">
                      {t("home.lightning")}
                    </h6>
                    <p>
                      Lightning: ready({data.ln_default_ready}) starts(
                      {data.system_count_start_lightning})
                    </p>
                  </article>
                )}
              {data.ln_default &&
                data.ln_default !== "none" &&
                data.ln_default_locked !== "0" &&
                !runningUnlock && (
                  <div className="flex flex-col justify-center">
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
                      onClick={unlockWallet}
                      className="bd-button my-5 p-2"
                    >
                      {t("setup.sync_wallet_unlock")}
                    </button>
                  </div>
                )}
              {runningUnlock && (
                <div className="flex justify-center">
                  <LoadingSpinner color="text-yellow-500" />
                </div>
              )}
            </div>
          </div>
          <div className="mx-auto flex flex-col justify-center">
            <button
              onClick={() => callback("shutdown", null)}
              className="bd-button my-5 p-2"
            >
              {t("settings.shutdown")}
            </button>
            <div className="text-center text-sm italic">
              {t("setup.sync_restartinfo")}
            </div>
          </div>
        </div>
      </section>
    </SetupContainer>
  );
};

export default SyncScreen;
