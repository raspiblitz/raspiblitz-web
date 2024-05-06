import { Button, Input } from "@nextui-org/react";

import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";

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

          <p className="text-center text-sm italic">
            {t(`setup.password_${passwordType}_details`)}
          </p>

          <form onSubmit={handleSubmit(continueHandler)} className="w-full">
            <fieldset className="w-full">
              <Input
                className="w-full"
                type="password"
                label={t(`setup.password_${passwordType}_name`)}
                isInvalid={!!errors.passfirst}
                errorMessage={errors.passfirst?.message}
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
              />

              <Input
                className="w-full"
                type="password"
                label={`${t("setup.password_repeat")} ${t(`setup.password_${passwordType}_name`)}`}
                isInvalid={!!errors.passrepeat}
                errorMessage={errors.passrepeat?.message}
                {...register("passrepeat", {
                  required: t("setup.password_error_empty"),
                  onChange: changePasswordRepeatHandler,
                  validate: validatePassRepeat,
                })}
              />
            </fieldset>

            <article className="flex flex-col items-center justify-center gap-10">
              <Button
                type="submit"
                isDisabled={!isValid}
                color="primary"
                className="mt-8 rounded-full px-8 py-6 font-semibold"
              >
                {t("setup.continue")}
              </Button>
              <Button
                type="button"
                color="danger"
                variant="light"
                onClick={handleCancel}
              >
                {t("setup.cancel")}
              </Button>
            </article>
          </form>
        </section>
      </SetupContainer>
    </>
  );
};

export default InputPassword;
