import {
  FieldError,
  Input,
  Label,
  TextField,
  useDisclosure,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/Button";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";

export type Props = {
  callback: (nodename: string | null) => void;
};

interface IFormInputs {
  inputNodeName: string;
}

export default function InputNodeName({ callback }: Props) {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const continueHandler = (data: IFormInputs) => {
    callback(data.inputNodeName);
  };

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
              <Controller
                name="inputNodeName"
                control={control}
                rules={{
                  required: t("setup.input_node.err_empty"),
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
                    <Label>{t("setup.input_node.label")}</Label>
                    <Input
                      type="text"
                      placeholder="e.g. MyRaspiBlitz"
                      className="bg-tertiary"
                    />
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
                variant="danger"
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
