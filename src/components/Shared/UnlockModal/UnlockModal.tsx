import { FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ModalDialog, {
  disableScroll,
} from "../../../container/ModalDialog/ModalDialog";
import { AppContext } from "../../../store/app-context";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import InputField from "../InputField/InputField";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type Props = {
  onClose: (unlocked: boolean) => void;
};

const UnlockModal: FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const { setWalletLocked } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [passwordWrong, setPasswordWrong] = useState(false);

  const unlockHandler = (data: { passwordInput: string }) => {
    setIsLoading(true);
    instance
      .post("/lightning/unlock-wallet", { password: data.passwordInput })
      .then((res) => {
        if (res.data) {
          setWalletLocked(false);
          // disableScroll doesn't trigger on modal close
          disableScroll.off();
          onClose(true);
        }
      })
      .catch((_) => {
        setIsLoading(false);
        setPasswordWrong(true);
      });
  };

  return createPortal(
    <ModalDialog closeable={false} close={() => onClose(false)}>
      {isLoading && (
        <article className="py-5">
          <h2 className="font-bold text-lg pb-5">{t("wallet.unlocking")}</h2>
          <LoadingSpinner />
        </article>
      )}
      {!isLoading && (
        <>
          <h2 className="font-bold text-lg mt-5">{t("wallet.unlock_title")}</h2>
          <article>
            <h5 className="p-2">{t("wallet.unlock_subtitle")}</h5>
            <form onSubmit={handleSubmit(unlockHandler)}>
              <InputField
                {...register("passwordInput", {
                  required: t("forms.validation.unlock.required") as string,
                })}
                label={t("forms.validation.unlock.pass_c")}
                errorMessage={errors.passwordInput}
                placeholder={t("forms.validation.unlock.pass_c")}
                type="password"
              />
              <button
                type="submit"
                className="bd-button p-3 my-5"
                disabled={!isValid}
              >
                {t("wallet.unlock")}
              </button>
            </form>
          </article>
          {passwordWrong && (
            <p className="my-5 text-red-500">{t("login.invalid_pass")}</p>
          )}
        </>
      )}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default UnlockModal;
