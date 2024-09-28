import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import CapsLockWarning from "@/components/CapsLockWarning";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import InputField from "@/components/InputField";
import { AppContext } from "@/context/app-context";
import useCapsLock from "@/hooks/use-caps-lock";
import { instance } from "@/utils/interceptor";
import { ModalFooter, ModalBody } from "@nextui-org/react";
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
      headline={t("wallet.unlock_subtitle")}
      disclosure={disclosure}
      customContent={
        <form onSubmit={handleSubmit(unlockHandler)}>
          <ModalBody>
            <p>{t("wallet.unlock_subtitle")}</p>

            {isCapsLockEnabled && <CapsLockWarning />}

            <fieldset className="flex w-full flex-col gap-4">
              <InputField
                {...register("passwordInput", {
                  required: t("forms.validation.unlock.required"),
                })}
                autoFocus
                errorMessage={errors.passwordInput}
                label={t("forms.validation.unlock.pass_c")}
                placeholder={t("forms.validation.unlock.pass_c")}
                type="password"
                disabled={isLoading}
                {...keyHandlers}
              />
            </fieldset>

            {isServerError && (
              <Alert color="danger">{t("login.invalid_pass")}</Alert>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              disabled={isLoading || !isValid}
              isLoading={isLoading}
            >
              {isLoading ? t("wallet.unlocking") : t("wallet.unlock")}
            </Button>
          </ModalFooter>
        </form>
      }
    />
  );
}
