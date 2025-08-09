import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@heroui/react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import type { SetupPhase } from "@/models/setup.model";

export type Props = {
  setupPhase: SetupPhase;
  seedWords: string | null;
  callback: () => void;
};

interface IFormInputs {
  confirm: boolean;
}

export default function FinalDialog({
  setupPhase,
  seedWords,
  callback,
}: Props) {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  return (
    <SetupContainer currentStep={null}>
      <form
        onSubmit={handleSubmit(callback)}
        className="flex flex-col items-center"
      >
        <section className="flex h-full flex-col items-center justify-center gap-y-10 pt-8 lg:w-3/5 lg:p-8">
          <div className="text-center">
            <CheckCircleIcon className="inline-block h-24 w-auto stroke-1 text-success" />
            <Headline>{t(`setup.final_${setupPhase || "setup"}`)}</Headline>
          </div>

          {!!seedWords && <Alert as="h4">{t("setup.final_seedwords")}</Alert>}

          {!!seedWords && (
            <ol className="flex h-104 w-full list-decimal flex-col flex-wrap gap-x-8 rounded-3xl bg-tertiary pl-20 pt-3 font-bold lowercase">
              {seedWords.split(", ").map((word, index) => {
                return (
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  <li key={index} className="my-3 pl-2">
                    {word}
                  </li>
                );
              })}
            </ol>
          )}

          {!!seedWords && (
            <Controller
              control={control}
              name="confirm"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Checkbox onChange={onChange} isSelected={value}>
                  {t("setup.final_info_reboot")}
                </Checkbox>
              )}
            />
          )}

          <article className="flex flex-col items-center justify-center pb-4">
            <Button
              type="submit"
              isDisabled={!isValid && !!seedWords}
              color="primary"
            >
              {t("setup.final_do_reboot")}
            </Button>
          </article>
        </section>
      </form>
    </SetupContainer>
  );
}
