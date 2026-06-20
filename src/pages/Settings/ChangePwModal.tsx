import {
  FieldError,
  Input,
  Label,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { type FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Button } from "@/components/Button";
import CapsLockWarning from "@/components/CapsLockWarning";
import { ConfirmModal } from "@/components/ConfirmModal";
import useCapsLock from "@/hooks/use-caps-lock";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import ActionBox from "./ActionBox";

interface IFormInputs {
  oldPassword: string;
  newPassword: string;
}

const ChangePwModal: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const confirmModal = useOverlayState();

  const { isCapsLockEnabled, keyHandlers } = useCapsLock();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const changePwHandler = (data: IFormInputs) => {
    setIsLoading(true);

    const params = {
      type: "a",
      old_password: data.oldPassword,
      new_password: data.newPassword,
    };

    instance
      .post("/system/change-password", {}, { params })
      .then(() => {
        toast.success(t("settings.pass_a_changed"), { theme: "dark" });
        confirmModal.close();
      })
      .catch((err) => {
        toast.error(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
        reset();
      });
  };

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={t("settings.change_pw_a")}
        isLoading={isLoading}
        custom
      >
        <form onSubmit={handleSubmit(changePwHandler)}>
          <ConfirmModal.Header>{t("settings.change_pw_a")}</ConfirmModal.Header>
          <ConfirmModal.Body>
            {isCapsLockEnabled && <CapsLockWarning />}

            <fieldset className="flex w-full flex-col gap-4">
              <Controller
                name="oldPassword"
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
                    <Label>{t("settings.old_pw")}</Label>
                    <Input
                      type="password"
                      className="bg-tertiary"
                      {...keyHandlers}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />

              <Controller
                name="newPassword"
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
                    <Label>{t("settings.new_pw")}</Label>
                    <Input
                      type="password"
                      className="bg-tertiary"
                      {...keyHandlers}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </TextField>
                )}
              />
            </fieldset>
          </ConfirmModal.Body>

          <ConfirmModal.Footer>
            <Button
              onPress={() => {
                confirmModal.close();
                reset();
              }}
              isDisabled={isLoading}
            >
              {t("settings.cancel")}
            </Button>
            <Button
              variant="primary"
              type="submit"
              isDisabled={isLoading || !isValid}
              isPending={isLoading}
            >
              {t("settings.confirm")}
            </Button>
          </ConfirmModal.Footer>
        </form>
      </ConfirmModal>

      <ActionBox
        name={t("settings.change_pw_a")}
        actionName={t("settings.change")}
        action={() => confirmModal.open()}
        showChild={false}
      />
    </>
  );
};

export default ChangePwModal;
