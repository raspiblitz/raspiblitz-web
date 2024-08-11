import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { Input, useDisclosure } from "@nextui-org/react";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Props = {
  callback: (nodename: string | null) => void;
};

interface IFormInputs {
  inputNodeName: string;
}

export default function InputNodeName({ callback }: Props) {
  const [inputNodeName, setInputNodeName] = useState("");

  const { t } = useTranslation();

  const changeNodenameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputNodeName(event.target.value);
  };

  const continueHandler = () => {
    callback(inputNodeName);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const confirmModal = useDisclosure();

  return (
    <>
      <ConfirmModal
        disclosure={confirmModal}
        headline={`${t("setup.cancel_setup")}?`}
        onConfirm={() => callback(null)}
      />

      <SetupContainer currentStep={2}>
        <section className="flex h-full flex-col items-center justify-center p-8">
          <Headline>{t("setup.input_node.header")}</Headline>

          <form
            onSubmit={handleSubmit(continueHandler)}
            className="mt-2 w-full"
          >
            <fieldset className="w-full">
              <Input
                className="w-full"
                classNames={{
                  inputWrapper:
                    "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
                }}
                type="text"
                label={t("setup.input_node.label")}
                placeholder="e.g. MyRaspiBlitz"
                isInvalid={!!errors.inputNodeName}
                errorMessage={errors.inputNodeName?.message}
                {...register("inputNodeName", {
                  required: t("setup.input_node.err_empty"),
                  onChange: changeNodenameHandler,
                  pattern: {
                    value: /^[a-zA-Z0-9]*$/,
                    message: t("setup.input_node.err_only_chars"),
                  },
                  minLength: {
                    value: 4,
                    message: t("setup.input_node.err_min_length"),
                  },
                  maxLength: {
                    value: 32,
                    message: t("setup.input_node.err_max_length"),
                  },
                })}
              />
            </fieldset>

            <article className="flex flex-col items-center justify-center gap-10 pt-10">
              <Button type="submit" isDisabled={!isValid} color="primary">
                {t("setup.continue")}
              </Button>
              <Button
                type="button"
                color="danger"
                variant="light"
                onClick={() => confirmModal.onOpen()}
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
