import ActionBox from "./ActionBox";
import { Button } from "@/components/Button";
import CapsLockWarning from "@/components/CapsLockWarning";
import ConfirmModal from "@/components/ConfirmModal";
import useCapsLock from "@/hooks/use-caps-lock";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { Input, useDisclosure } from "@nextui-org/react";
import { ModalFooter, ModalBody } from "@nextui-org/react";
import { type FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface IFormInputs {
  oldPassword: string;
  newPassword: string;
}

const ChangePwModal: FC = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const confirmModal = useDisclosure();

  const { isCapsLockEnabled, keyHandlers } = useCapsLock();

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
        toast.success(t("settings.pass_a_changed"));
        confirmModal.onClose();
      })
      .catch((err) => {
        toast.error(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
        reset();
      });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={t("settings.change_pw_a")}
        isLoading={isLoading}
        isFormModal={
          <form onSubmit={handleSubmit(changePwHandler)}>
            <ModalBody>
              {isCapsLockEnabled && <CapsLockWarning />}

              <fieldset className="flex w-full flex-col gap-4">
                <Input
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
                  }}
                  type="password"
                  label={t("settings.old_pw")}
                  isInvalid={!!errors.oldPassword}
                  errorMessage={errors.oldPassword?.message}
                  {...register("oldPassword", {
                    required: t("setup.password_error_empty"),
                    pattern: {
                      value: /^[a-zA-Z0-9.-]*$/,
                      message: t("setup.password_error_chars"),
                    },
                    minLength: {
                      value: 8,
                      message: t("setup.password_error_length"),
                    },
                  })}
                  {...keyHandlers}
                />

                <Input
                  className="w-full"
                  classNames={{
                    inputWrapper:
                      "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
                  }}
                  type="password"
                  label={t("settings.new_pw")}
                  isInvalid={!!errors.newPassword}
                  errorMessage={errors.newPassword?.message}
                  {...register("newPassword", {
                    required: t("setup.password_error_empty"),
                    pattern: {
                      value: /^[a-zA-Z0-9.-]*$/,
                      message: t("setup.password_error_chars"),
                    },
                    minLength: {
                      value: 8,
                      message: t("setup.password_error_length"),
                    },
                  })}
                  {...keyHandlers}
                />
              </fieldset>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onClick={() => {
                  confirmModal.onClose();
                  reset();
                }}
                disabled={isLoading}
              >
                {t("settings.cancel")}
              </Button>
              <Button
                color="primary"
                type="submit"
                disabled={isLoading || !isValid}
                isLoading={isLoading}
              >
                {t("settings.confirm")}
              </Button>
            </ModalFooter>
          </form>
        }
      />

      <ActionBox
        name={t("settings.change_pw_a")}
        actionName={t("settings.change")}
        action={() => confirmModal.onOpen()}
        showChild={false}
      />
    </>
  );
};

export default ChangePwModal;
