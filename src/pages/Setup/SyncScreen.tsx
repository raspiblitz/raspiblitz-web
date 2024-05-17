import {
  CheckCircleIcon,
  LockOpenIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { HttpStatusCode } from "axios";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ButtonWithSpinner from "@/components/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "@/components/InputField";
import Message from "@/components/Message";
import SetupContainer from "@/layouts/SetupContainer";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Input, Button, Progress } from "@nextui-org/react";

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
        if (err.response.status === HttpStatusCode.Forbidden) {
          navigate("/login?back=/setup");
        } else if (err.response.status === HttpStatusCode.Unauthorized) {
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

  const btcDefaultReady = data.btc_default_ready === "1";
  const btcDefaultSyncPercentage = +data.btc_default_sync_percentage;

  return (
    <SetupContainer>
      <section className="flex h-full w-96 max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
        <h2 className="text-center text-2xl font-semibold">
          {t("setup.sync_headline")}
        </h2>

        <div className="w-full">
          <Progress
            label={
              btcDefaultReady
                ? `${t("setup.sync_bitcoin_sync")}: ${btcDefaultSyncPercentage}%`
                : `${t("setup.sync_bitcoin_starting")}...`
            }
            value={btcDefaultSyncPercentage}
            isStriped
          />

          {/* {lnWalletUnlocked && ( */}
          <p className="mt-6">
            {data.ln_default_ready === "1" ? (
              <>
                <CheckCircleIcon className="inline h-6 w-auto text-success " />{" "}
                {t("home.lightning")} {t("setup.started")}
              </>
            ) : (
              <>
                <XCircleIcon className="inline h-6 w-auto text-danger" />{" "}
                {t("home.lightning")} {t("setup.not_started")}
              </>
            )}
            , {t("setup.restarts")}: {data.system_count_start_lightning}
          </p>
          {/*  )} */}

          {/* {lnWalletLocked && (
            <>
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

              {error && <Message message={error} />}
            </>
          )} */}
        </div>

        <article className="flex flex-col items-center justify-center gap-10">
          <Button
            type="button"
            onClick={() => callback("shutdown", null)}
            color="primary"
            className="rounded-full px-8 py-6 font-semibold"
            title={t("setup.sync_restartinfo")}
          >
            {t("settings.shutdown")}
          </Button>
        </article>
      </section>
    </SetupContainer>
  );
};

export default SyncScreen;
