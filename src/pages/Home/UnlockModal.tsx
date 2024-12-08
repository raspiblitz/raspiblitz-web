import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import CapsLockWarning from "@/components/CapsLockWarning";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { AppContext } from "@/context/app-context";
import useCapsLock from "@/hooks/use-caps-lock";
import { instance } from "@/utils/interceptor";
import { Input } from "@nextui-org/react";
import { useContext, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface IFormInputs {
  passwordInput: string;
}

export default function UnlockModal({
  disclosure,
}: Pick<ConfirmModalProps, "disclosure">) {
  const { t } = useTranslation();
  const { setWalletLocked } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isServerError, setIsServerError] = useState(false);
  const { isCapsLockEnabled, keyHandlers } = useCapsLock();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({ mode: "onChange" });

  const unlockHandler: SubmitHandler<IFormInputs> = (data: {
    passwordInput: string;
  }) => {
    setIsLoading(true);
    setIsServerError(false);
    instance
      .post("/lightning/unlock-wallet", { password: data.passwordInput })
      .then((res) => {
        if (res.data) {
          setWalletLocked(false);
          toast.success(t("wallet.unlock_success"), { theme: "dark" });
          disclosure.onClose();
        }
      })
      .catch((_) => {
        setIsLoading(false);
        setIsServerError(true);
      });
  };

  return (
    <ConfirmModal
      headline={t("wallet.unlock_title")}
      disclosure={disclosure}
      custom
    >
      <form onSubmit={handleSubmit(unlockHandler)}>
        <ConfirmModal.Body>
          <p>{t("wallet.unlock_subtitle")}</p>

          {isCapsLockEnabled && <CapsLockWarning />}

          <fieldset className="flex w-full flex-col gap-4">
            <Input
              autoFocus
              classNames={{
                inputWrapper:
                  "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
              }}
              isDisabled={isLoading}
              type="password"
              label={t("forms.validation.unlock.pass_c")}
              placeholder={t("forms.validation.unlock.pass_c")}
              isInvalid={!!errors.passwordInput}
              errorMessage={errors.passwordInput?.message}
              {...register("passwordInput", {
                required: t("forms.validation.unlock.required"),
              })}
              {...keyHandlers}
            />
          </fieldset>

          {isServerError && (
            <Alert color="danger">{t("login.invalid_pass")}</Alert>
          )}
        </ConfirmModal.Body>

        <ConfirmModal.Footer>
          <Button
            color="primary"
            type="submit"
            isDisabled={isLoading || !isValid}
            isLoading={isLoading}
          >
            {isLoading ? t("wallet.unlocking") : t("wallet.unlock")}
          </Button>
        </ConfirmModal.Footer>
      </form>
    </ConfirmModal>
  );
}
