import { ArrowSmallRightIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../components/ConfirmModal";
import InputField from "../../components/InputField";
import SetupContainer from "../../layouts/SetupContainer";

export type Props = {
  passwordType: "a" | "b" | "c";
  callback: (password: string | null) => void;
};

interface IFormInputs {
  passfirst: string;
  passrepeat: string;
}

const InputPassword: FC<Props> = ({ passwordType, callback }) => {
  const { t } = useTranslation();

  const [password, setPassword] = useState("");
  const [, setPasswordRepeat] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changePasswordRepeatHandler = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordRepeat(event.target.value);
  };

  const validatePassRepeat = (repeatPw: string): string | undefined => {
    return repeatPw === password ? undefined : t("setup.password_error_match");
  };

  const continueHandler = () => {
    callback(password);
    reset();
  };

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const hideConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          confirmText={`${t("setup.cancel_setup")}?`}
          onClose={hideConfirm}
          onConfirm={() => callback(null)}
        />
      )}
      <SetupContainer>
        <section className="flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-center text-lg font-bold">
            {t(`setup.password_${passwordType}_short`)}
          </h2>
          <span className="text-center text-sm italic">
            {t(`setup.password_${passwordType}_details`)}
          </span>
          <form
            onSubmit={handleSubmit(continueHandler)}
            className="flex h-full w-full flex-col py-1 md:w-10/12"
          >
            <article className="m-auto md:w-1/2">
              <InputField
                {...register("passfirst", {
                  required: t("setup.password_error_empty"),
                  onChange: changePasswordHandler,
                  pattern: {
                    value: /^[a-zA-Z0-9.-]*$/,
                    message: t("setup.password_error_chars"),
                  },
                  minLength: {
                    value: 8,
                    message: t("setup.password_error_length"),
                  },
                })}
                type="password"
                label={t(`setup.password_${passwordType}_name`)}
                errorMessage={errors.passfirst}
              />
              <InputField
                {...register("passrepeat", {
                  required: t("setup.password_error_empty"),
                  onChange: changePasswordRepeatHandler,
                  validate: validatePassRepeat,
                })}
                type="password"
                label={
                  t("setup.password_repeat") +
                  " " +
                  t(`setup.password_${passwordType}_name`)
                }
                errorMessage={errors.passrepeat}
              />
            </article>
            <article className="mt-10 flex flex-col items-center justify-center gap-10 md:flex-row">
              <button
                onClick={handleCancel}
                type="button"
                className="flex items-center justify-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
              >
                <XMarkIcon className="inline h-6 w-6" />
                <span className="p-2">{t("setup.cancel")}</span>
              </button>
              <button
                disabled={!isValid}
                type="submit"
                className="bd-button flex items-center justify-center px-2 disabled:bg-gray-400"
              >
                <span className="p-2">{t("setup.ok")}</span>
                <ArrowSmallRightIcon className="inline h-6 w-6" />
              </button>
            </article>
          </form>
        </section>
      </SetupContainer>
    </>
  );
};

export default InputPassword;
