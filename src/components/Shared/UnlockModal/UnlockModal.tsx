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

  const unlockHandler = (data: { passwordInput: string }) => {
    setIsLoading(true);
    instance
      .post("/lightning/unlock-wallet", { password: data.passwordInput })
      .then((res) => {
        if (res.data) {
          setWalletLocked(false);
          // disableScroll somehow doesn't trigger on Close
          disableScroll.off();
          onClose(true);
        }
      })
      .catch((_) => {
        setIsLoading(false);
      });
  };

  return createPortal(
    <ModalDialog close={() => onClose(false)}>
      {isLoading && (
        <>
          <h2 className="font-bold text-lg">Unlocking</h2>
          <LoadingSpinner />
        </>
      )}
      {!isLoading && (
        <>
          <h2 className="font-bold text-lg">Unlock Wallet</h2>
          <article>
            <div>Unlock your Wallet</div>
            <form onSubmit={handleSubmit(unlockHandler)}>
              <InputField
                {...register("passwordInput", {
                  required: t("forms.validation.unlock.required") as string,
                })}
                label={t("forms.validation.unlock.pass_c")}
                errorMessage={errors.passwordInput}
                placeholder={t("forms.validation.unlock.pass_c")}
              />
              <button
                type="submit"
                className="bd-button p-3 my-5"
                disabled={!isValid}
              >
                Unlock
              </button>
            </form>
          </article>
        </>
      )}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default UnlockModal;
