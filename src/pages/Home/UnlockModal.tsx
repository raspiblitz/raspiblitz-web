import { FieldError, Input, Label, TextField } from "@heroui/react";
import { useContext, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
    control,
    handleSubmit,
    formState: { isValid },
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
          disclosure.close();
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
            <Controller
              name="passwordInput"
              control={control}
              rules={{
                required: t("forms.validation.unlock.required"),
              }}
              render={({ field, fieldState }) => (
                <TextField
                  className="w-full"
                  isInvalid={fieldState.invalid}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  isDisabled={isLoading}
                >
                  <Label>{t("forms.validation.unlock.pass_c")}</Label>
                  <Input
                    autoFocus
                    type="password"
                    placeholder={t("forms.validation.unlock.pass_c")}
                    className="bg-tertiary"
                    {...keyHandlers}
                  />
                  <FieldError>{fieldState.error?.message}</FieldError>
                </TextField>
              )}
            />
          </fieldset>

          {isServerError && (
            <Alert color="danger">{t("login.invalid_pass")}</Alert>
          )}
        </ConfirmModal.Body>

        <ConfirmModal.Footer>
          <Button
            variant="primary"
            type="submit"
            isDisabled={isLoading || !isValid}
            isPending={isLoading}
          >
            {isLoading ? t("wallet.unlocking") : t("wallet.unlock")}
          </Button>
        </ConfirmModal.Footer>
      </form>
    </ConfirmModal>
  );
}
