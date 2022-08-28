import { LockOpenIcon } from "@heroicons/react/outline";
import { FC, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ButtonWithSpinner from "../../components/ButtonWithSpinner/ButtonWithSpinner";
import InputField from "../../components/InputField";
import Message from "../../components/Message";
import { AppContext } from "../../context/app-context";
import ModalDialog, { disableScroll } from "../../layouts/ModalDialog";
import { MODAL_ROOT } from "../../utils";
import { instance } from "../../utils/interceptor";

interface IFormInputs {
  passwordInput: string;
}

type Props = {
  onClose: () => void;
};

const UnlockModal: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const { setWalletLocked, darkMode } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordWrong, setPasswordWrong] = useState(false);
  const theme = darkMode ? "dark" : "light";

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({ mode: "onChange" });

  const unlockHandler: SubmitHandler<IFormInputs> = (data: {
    passwordInput: string;
  }) => {
    setIsLoading(true);
    setPasswordWrong(false);
    instance
      .post("/lightning/unlock-wallet", { password: data.passwordInput })
      .then((res) => {
        if (res.data) {
          setWalletLocked(false);
          toast.success(t("wallet.unlock_success"), { theme });
          onClose();
        }
      })
      .catch((_) => {
        setIsLoading(false);
        setPasswordWrong(true);
      });
  };

  useEffect(() => {
    return () => disableScroll.off();
  }, []);

  return createPortal(
    <ModalDialog closeable={false} close={() => onClose()}>
      <h2 className="mt-5 text-lg font-bold">{t("wallet.unlock_title")}</h2>

      <div>
        <h3 className="p-2">{t("wallet.unlock_subtitle")}</h3>

        <form onSubmit={handleSubmit(unlockHandler)}>
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
          />
          <ButtonWithSpinner
            type="submit"
            className="bd-button my-5 p-3"
            loading={isLoading}
            disabled={!isValid}
            icon={<LockOpenIcon className="mx-1 h-6 w-6" />}
          >
            {isLoading ? t("wallet.unlocking") : t("wallet.unlock")}
          </ButtonWithSpinner>
        </form>
      </div>

      {passwordWrong && <Message message={t("login.invalid_pass")} />}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default UnlockModal;
