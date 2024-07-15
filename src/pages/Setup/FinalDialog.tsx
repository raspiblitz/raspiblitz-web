import { Alert } from "@/components/Alert";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Checkbox } from "@nextui-org/react";
import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Props = {
  setupPhase: SetupPhase;
  seedWords: string;
  callback: () => void;
};

interface IFormInputs {
  confirm: boolean;
}

const FinalDialog: FC<Props> = ({ setupPhase, seedWords, callback }) => {
  const { t } = useTranslation();
  const words = seedWords.split(", ");
  const isSetupRecovery = setupPhase === SetupPhase.RECOVERY;

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
        <section className="flex h-full flex-col items-center justify-center gap-y-10 lg:w-2/5 lg:p-8 pt-8">
          <div className="text-center">
            <CheckCircleIcon className="inline-block h-24 w-auto stroke-1 text-success" />
            <Headline>{t(`setup.final_${setupPhase || "setup"}`)}</Headline>
          </div>

          {seedWords && <Alert as="h4">{t("setup.final_seedwords")}</Alert>}

          {seedWords && (
            <ol className="flex h-[26rem] w-full list-decimal flex-col flex-wrap gap-x-8 rounded-3xl bg-tertiary pl-20 pt-3 font-bold lowercase">
              {words.map((word, i) => {
                return (
                  <li key={i} className="my-3 pl-2">
                    {word}
                  </li>
                );
              })}
            </ol>
          )}

          {!isSetupRecovery && (
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

          <article className="justify-center flex flex-col items-center pb-4">
            <Button
              type="submit"
              isDisabled={!isValid || !isSetupRecovery}
              color="primary"
            >
              {t("setup.final_do_reboot")}
            </Button>
          </article>
        </section>
      </form>
    </SetupContainer>
  );
};

export default FinalDialog;
