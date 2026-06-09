import {
  FieldError,
  Input,
  Label,
  TextField,
  useDisclosure,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";

type Props = {
  passwordType: PasswordColors;
  callback: (password: string | null) => void;
};

interface IFormInputs {
  passfirst: string;
  passrepeat: string;
}

const passwordColors = {
  a: "text-danger",
  b: "text-accent",
  c: "text-warning",
};

type PasswordColors = keyof typeof passwordColors;

export default function InputPassword({ passwordType, callback }: Props) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const continueHandler = (data: IFormInputs) => {
    callback(data.passfirst);
    reset();
  };

  const confirmModal = useDisclosure();

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={`${t("setup.cancel_setup")}?`}
        onConfirm={() => callback(null)}
      />

      <SetupContainer currentStep={4}>
        <section className="flex h-full flex-col items-center justify-center p-8">
          <Headline>
            <Trans
              i18nKey={`setup.password_${passwordType}_short`}
              t={t}
              components={[
                <strong
                  key="passwordType"
                  className={`font-semibold ${passwordColors[passwordType]}`}
                />, // if needed, create a component for this
              ]}
            />
          </Headline>

          <p className="m-2 text-center text-secondary">
            <Trans
              i18nKey={`setup.password_${passwordType}_details`}
              t={t}
              components={[
                <strong
                  key="passwordType"
                  className={`font-semibold ${passwordColors[passwordType]}`}
                />, // if needed, create a component for this
              ]}
            />
          </p>

          <form onSubmit={handleSubmit(continueHandler)} className="w-full">
            <fieldset className="flex w-full flex-col gap-4">
              <Controller
                name="passfirst"
                control={control}
                rules={{
                  required: t("setup.password_error_empty"),
                  pattern: {
                    value: /^[a-zA-Z0-9.-]*$/,
                    message: t("setup.password_error_chars"),
                  },
                  minLength: {
                    value: 8,
                    message: t("setup.password_error_length"),
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    className="w-full"
                    isInvalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  >
                    <Label>{t(`setup.password_${passwordType}_name`)}</Label>
                    <Input type="password" className="bg-tertiary" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                name="passrepeat"
                control={control}
                rules={{
                  required: t("setup.password_error_empty"),
                  validate: (value) =>
                    value === watch("passfirst") ||
                    t("setup.password_error_match"),
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    className="w-full"
                    isInvalid={fieldState.invalid}
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  >
                    <Label>{`${t("setup.password_repeat")} ${t(`setup.password_${passwordType}_name`)}`}</Label>
                    <Input type="password" className="bg-tertiary" />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />
            </fieldset>

            <article className="flex flex-col items-center justify-center gap-10 pt-10">
              <Button type="submit" isDisabled={!isValid} variant="primary">
                {t("setup.continue")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onPress={() => confirmModal.onOpen()}
              >
                {t("setup.cancel")}
              </Button>
            </article>
          </form>
        </section>
      </SetupContainer>
    </>
  );
}
