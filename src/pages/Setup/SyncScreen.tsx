import {
  CheckCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  PowerIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@heroui/react";
import { HttpStatusCode } from "axios";
import { type ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";

type Props = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: SyncData | any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        <Modal
          isOpen={isOpen}
          isDismissable={false}
          onOpenChange={onOpenChange}
        >
          <form
            className="flex flex-col justify-center"
            onSubmit={handleSubmit(unlockWallet)}
          >
            <ModalContent>
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {t("wallet.unlock_subtitle")}
                </ModalHeader>
                <ModalBody>
                  <>
                    <Input
                      classNames={{
                        inputWrapper:
                          "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
                      }}
                      type="password"
                      label={t("setup.sync_wallet_info")}
                      isDisabled={runningUnlock}
                      isInvalid={!!errors.passwordInput}
                      errorMessage={errors.passwordInput?.message}
                      value={password}
                      {...register("passwordInput", {
                        required: t("setup.password_error_empty"),
                        onChange: changePasswordHandler,
                      })}
                    />

                    {error && <Alert color="danger">{error}</Alert>}
                  </>
                </ModalBody>
                <ModalFooter>
                  <Button
                    type="submit"
                    color="primary"
                    isLoading={runningUnlock}
                  >
                    {t("setup.sync_wallet_unlock")}
                  </Button>
                </ModalFooter>
              </>
            </ModalContent>
          </form>
        </Modal>
      )}

      <SetupContainer currentStep={null}>
        <section className="flex h-full w-96 max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
          <Headline>{t("setup.sync_headline")}</Headline>

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
                      <Button onPress={onOpen} color="primary">
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
            <Button
              type="button"
              onPress={() => callback("shutdown", null)}
              color="primary"
              title={t("setup.sync_restartinfo")}
              startContent={<PowerIcon className="inline h-6 w-auto" />}
            >
              {t("settings.shutdown")}
            </Button>
          </article>
        </section>
      </SetupContainer>
    </>
  );
}
