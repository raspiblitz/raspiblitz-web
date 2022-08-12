import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CheckCircleIcon } from "../../assets/check-circle.svg";
import { ReactComponent as LockOpenIcon } from "../../assets/lock-open.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-circle.svg";
import Message from "../../container/Message/Message";
import ProgressCircle from "../../container/ProgressCircle/ProgressCircle";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { checkError } from "../../util/checkError";
import { instance } from "../../util/interceptor";
import ButtonWithSpinner from "../../components/Shared/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../../components/Shared/InputField/InputField";

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

interface IFormInputs {
  passwordInput: string;
}

const SyncScreen: FC<InputData> = ({ data, callback }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [runningUnlock, setRunningUnlock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const unlockWallet = () => {
    setRunningUnlock(true);
    setError(null);
    instance
      .post("/lightning/unlock-wallet", {
        password: password,
      })
      .then(() => {
        setPassword("");
        setRunningUnlock(false);
        data.ln_default_locked = "0";
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login?back=/setup");
        } else if (err.response.status === 401) {
          setPassword("");
          setRunningUnlock(false);
          setError(`${t("login.error")}: ${t("login.invalid_pass")}`);
        } else {
          setPassword("");
          setRunningUnlock(false);
          setError(checkError(err));
        }
      });
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const lnEnabled = data.ln_default && data.ln_default !== "none";

  const lnWalletLocked = lnEnabled && data.ln_default_locked === "1";
  const lnWalletUnlocked = lnEnabled && data.ln_default_locked === "0";

  return (
    <SetupContainer>
      <section className="flex h-full flex-col items-center justify-center md:p-8">
        <h2 className="text-center text-lg font-bold">
          {t("setup.sync_headline")}
        </h2>
        <div className="flex h-full w-full flex-col py-1 md:w-10/12">
          <article className="my-auto flex flex-col items-center justify-between md:flex-row">
            <div className="my-8 flex w-full justify-center md:my-0 md:w-1/2">
              <ProgressCircle
                progress={+data.btc_default_sync_percentage}
                starting={data.btc_default_ready !== "1"}
              />
            </div>
            <div className="flex w-full flex-col justify-center md:w-1/2">
              {lnWalletUnlocked && (
                <article>
                  <h6 className="text-sm text-gray-500 dark:text-gray-300">
                    {t("home.lightning")}
                  </h6>
                  <div className="flex justify-around">
                    <p className="flex gap-2">
                      {t("setup.started")}:
                      {data.ln_default_ready === "1" ? (
                        <CheckCircleIcon className="inline h-6 w-6" />
                      ) : (
                        <XCircleIcon className="inline h-6 w-6" />
                      )}
                    </p>
                    <p className="flex">
                      {t("setup.restarts")}: {data.system_count_start_lightning}
                    </p>
                  </div>
                </article>
              )}
              {lnWalletLocked && (
                <form
                  className="flex flex-col justify-center"
                  onSubmit={handleSubmit(unlockWallet)}
                >
                  <InputField
                    {...register("passwordInput", {
                      required: t("setup.password_error_empty"),
                      onChange: changePasswordHandler,
                    })}
                    type="password"
                    label={t("setup.sync_wallet_info")}
                    disabled={runningUnlock}
                    errorMessage={errors.passwordInput}
                    value={password}
                  />
                  <ButtonWithSpinner
                    type="submit"
                    onClick={unlockWallet}
                    loading={runningUnlock}
                    disabled={!isValid}
                    icon={<LockOpenIcon className="mx-1 inline h-6 w-6" />}
                    className="bd-button my-5 p-2"
                  >
                    {t("setup.sync_wallet_unlock")}
                  </ButtonWithSpinner>
                </form>
              )}
              {lnWalletLocked && error && <Message message={error} />}
            </div>
          </article>
          <article className="mx-auto flex flex-col justify-center">
            <button
              onClick={() => callback("shutdown", null)}
              className="bd-button my-5 p-2"
            >
              {t("settings.shutdown")}
            </button>
            <p className="text-center text-sm italic">
              {t("setup.sync_restartinfo")}
            </p>
          </article>
        </div>
      </section>
    </SetupContainer>
  );
};

export default SyncScreen;
