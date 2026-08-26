import {
  CheckCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  PowerIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  FieldError,
  Input,
  Label,
  Modal,
  ProgressBar,
  TextField,
  Tooltip,
  useOverlayState,
} from "@heroui/react";
import { HttpStatusCode } from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: value is expected to exist at this point
  data: SyncData | any;
  // biome-ignore lint/suspicious/noExplicitAny: value is expected to exist at this point
  callback: (action: string, data: any) => void;
};

interface SyncData {
  initialSync: string;
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

export default function SyncScreen({ data, callback }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disclosure = useOverlayState();

  const [password, setPassword] = useState("");
  const [runningUnlock, setRunningUnlock] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const lnEnabled = data.ln_default && data.ln_default !== "none";

  const lnWalletLocked = lnEnabled && data.ln_default_locked === "1";
  const lnWalletUnlocked = lnEnabled && data.ln_default_locked === "0";

  const btcDefaultReady = data.btc_default_ready === "1";
  const btcDefaultSyncPercentage = +data.btc_default_sync_percentage;

  return (
    <>
      {lnWalletLocked && (
        <Modal state={disclosure}>
          <Modal.Backdrop isDismissable={false}>
            <Modal.Container>
              <Modal.Dialog>
                <form
                  className="flex flex-col justify-center"
                  onSubmit={handleSubmit(unlockWallet)}
                >
                  <Modal.Header className="flex flex-col gap-1">
                    <Modal.Heading>{t("wallet.unlock_subtitle")}</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <Controller
                      name="passwordInput"
                      control={control}
                      rules={{
                        required: t("setup.password_error_empty"),
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          className="w-full"
                          isDisabled={runningUnlock}
                          isInvalid={fieldState.invalid}
                          value={password}
                          onChange={(value) => {
                            setPassword(value);
                            field.onChange(value);
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                        >
                          <Label>{t("setup.sync_wallet_info")}</Label>
                          <Input type="password" className="bg-tertiary" />
                          <FieldError>
                            {errors.passwordInput?.message}
                          </FieldError>
                        </TextField>
                      )}
                    />

                    {error && <Alert color="danger">{error}</Alert>}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      type="submit"
                      variant="primary"
                      isPending={runningUnlock}
                    >
                      {t("setup.sync_wallet_unlock")}
                    </Button>
                  </Modal.Footer>
                </form>
              </Modal.Dialog>
            </Modal.Container>
          </Modal.Backdrop>
        </Modal>
      )}

      <SetupContainer currentStep={null}>
        <section className="flex h-full w-96 max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
          <Headline>{t("setup.sync_headline")}</Headline>

          <div className="w-full">
            <ProgressBar value={btcDefaultSyncPercentage}>
              <ProgressBar.Output className="mb-2 block text-sm">
                {btcDefaultReady
                  ? `${t("setup.sync_bitcoin_sync")}: ${btcDefaultSyncPercentage}%`
                  : `${t("setup.sync_bitcoin_starting")}...`}
              </ProgressBar.Output>
              <ProgressBar.Track className="h-2 w-full overflow-hidden rounded-full bg-tertiary">
                <ProgressBar.Fill className="h-full rounded-full bg-accent" />
              </ProgressBar.Track>
            </ProgressBar>

            {(lnWalletUnlocked || lnWalletLocked) && (
              <div className="mt-6">
                <Alert color="info" as="div">
                  {lnWalletUnlocked && (
                    <>
                      <p>
                        <LockOpenIcon className="inline h-6 w-auto text-success" />{" "}
                        {t("wallet.unlock_success")}
                      </p>
                      <div className="mt-2">
                        {data.ln_default_ready === "1" ? (
                          <>
                            <CheckCircleIcon className="inline h-6 w-auto text-success" />{" "}
                            {t("home.lightning")} {t("setup.started")}
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="inline h-6 w-auto text-danger" />{" "}
                            {t("home.lightning")} {t("setup.not_started")}
                          </>
                        )}
                        <p>
                          ({t("setup.restarts")}:{" "}
                          {data.system_count_start_lightning})
                        </p>
                      </div>
                    </>
                  )}

                  {lnWalletLocked && (
                    <div className="flex flex-col gap-4">
                      <p>
                        <LockClosedIcon className="inline h-6 w-auto text-danger" />{" "}
                        {t("wallet.wallet_locked")}
                      </p>
                      <Button onPress={disclosure.open} variant="primary">
                        {t("wallet.unlock_title")}
                      </Button>
                      <p>{t("wallet.wallet_unlock_info")}</p>
                    </div>
                  )}
                </Alert>
              </div>
            )}
          </div>

          <article className="flex flex-col items-center justify-center gap-10 pt-10">
            <Tooltip>
              <Tooltip.Trigger>
                <Button
                  type="button"
                  onPress={() => callback("shutdown", null)}
                  variant="primary"
                >
                  <span className="flex items-center gap-2">
                    <PowerIcon className="inline h-6 w-auto" />
                    {t("settings.shutdown")}
                  </span>
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>{t("setup.sync_restartinfo")}</Tooltip.Content>
            </Tooltip>
          </article>
        </section>
      </SetupContainer>
    </>
  );
}
