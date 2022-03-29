import { FC, ChangeEvent, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ActionBoxProps } from "../../container/ActionBox/ActionBox";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { instance } from "../../util/interceptor";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";

export interface InputData {
  data: any;
  callback: (action: string, data: any) => void;
}

const SyncScreen: FC<InputData> = (props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [Password, setPassword] = useState("");
  const [RunningUnlock, setRunningUnlock] = useState(false);

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const unlockWallet = async () => {
    setRunningUnlock(true);
    try {
      const resp = await instance
        .post("/lightning/unlock-wallet", {
          password: Password,
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
    } catch {
      console.log("error on unlock wallet");
      setPassword("");
      setRunningUnlock(false);
    }
  };

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">RaspiBlitz Initial Sync</div>
        <br />
        {props.data.btc_default_ready === "1" && (
          <span>
            <div className="text-center text-sm">
              Blockchain Sync: {props.data.btc_default_sync_percentage}% (
              {props.data.btc_default_peers} peers)
            </div>
          </span>
        )}
        {props.data.btc_default_ready !== "1" && (
          <span>
            <div className="text-center text-sm">
              ... Bitcoin starting ({props.data.system_count_start_blockchain})
              ...
            </div>
          </span>
        )}
        {props.data.n_default !== "" &&
          props.data.n_default !== "none" &&
          props.data.ln_default_locked !== "1" && (
            <span>
              <div className="text-center text-sm">
                Lightning: ready({props.data.ln_default_ready}) starts(
                {props.data.system_count_start_lightning})
              </div>
            </span>
          )}
        {props.data.n_default !== "" &&
          props.data.n_default !== "none" &&
          props.data.ln_default_locked !== "0" &&
          !RunningUnlock && (
            <div className="justify-center">
              <label htmlFor="passfirst" className="label-underline">
                Please unlock your Lightning Wallet (Password C):
              </label>
              <input
                id="passfirst"
                className="input-underline w-full"
                type="password"
                value={Password}
                onChange={changePasswordHandler}
                required
              />
              <button
                onClick={() => unlockWallet()}
                className="bd-button my-5 p-2"
              >
                Unlock Wallet
              </button>
            </div>
          )}
        {RunningUnlock && (
          <div className="justify-center">
            <LoadingSpinner color="text-yellow-500" />
          </div>
        )}
        <button
          onClick={() => props.callback("shutdown", null)}
          className="bd-button my-5 p-2"
        >
          Shutdown
        </button>
        <div className="text-center text-sm italic">
          (sync will continue on next restart)
        </div>
      </div>
    </SetupContainer>
  );
};

export default SyncScreen;
