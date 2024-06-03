import ConfirmModal from "@/components/ConfirmModal";
import SetupContainer from "@/layouts/SetupContainer";
import { Button, Input } from "@nextui-org/react";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";

export type Props = {
  passwordType: "a" | "b" | "c";
  callback: (password: string | null) => void;
};

interface IFormInputs {
  passfirst: string;
  passrepeat: string;
}

const passwordColors = {
  a: "text-danger",
  b: "text-primary",
  c: "text-warning",
};

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
          <h1 className="m-2 text-center text-3xl font-semibold">
            <Trans
              i18nKey={`setup.password_${passwordType}_short`}
              t={t}
              components={[
                <strong
                  className={`font-semibold ${passwordColors[passwordType]}`}
                ></strong>, // if needed, create a component for this
              ]}
            />
          </h1>
          <p className="m-2 text-center text-secondary">
            <Trans
              i18nKey={`setup.password_${passwordType}_details`}
              t={t}
              components={[
                <strong
                  className={`font-semibold ${passwordColors[passwordType]}`}
                ></strong>, // if needed, create a component for this
              ]}
            />
          </p>

          <form onSubmit={handleSubmit(continueHandler)} className="w-full">
            <fieldset className="flex w-full flex-col gap-4">
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
              <Button type="submit" isDisabled={!isValid} color="primary">
                {t("setup.continue")}
              </Button>
              <Button
                type="button"
                color="secondary"
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
