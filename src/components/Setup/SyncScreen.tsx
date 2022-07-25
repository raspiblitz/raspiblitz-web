import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ReactComponent as CheckCircleIcon } from "../../assets/check-circle.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-circle.svg";
import Message from "../../container/Message/Message";
import ProgressCircle from "../../container/ProgressCircle/ProgressCircle";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { instance } from "../../util/interceptor";
import ButtonWithSpinner from "../Shared/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../Shared/InputField/InputField";

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
  const [passwordWrong, setPasswordWrong] = useState(false);

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const unlockWallet = () => {
    setRunningUnlock(true);
    setPasswordWrong(false);
    instance
      .post("/lightning/unlock-wallet", {
        password: password,
      })
      .then(() => {
        setPassword("");
        setRunningUnlock(false);
      })
      .catch((err) => {
        if (err.response.status === 403) {
          navigate("/login?back=/setup");
        } else {
          setPassword("");
          setRunningUnlock(false);
          setPasswordWrong(true);
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
                progress={+data.btc_default_sync_percentage}
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
                        {t("setup.restarts")}:{" "}
                        {data.system_count_start_lightning}
                      </p>
                    </div>
                  </article>
                )}
              {data.ln_default &&
                data.ln_default !== "none" &&
                data.ln_default_locked !== "0" && (
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
                      className="bd-button my-5 p-2"
                    >
                      {t("setup.sync_wallet_unlock")}
                    </ButtonWithSpinner>
                  </form>
                )}
              {passwordWrong && <Message message={t("login.invalid_pass")} />}
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
