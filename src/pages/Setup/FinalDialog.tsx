import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";

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

  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  return (
    <SetupContainer>
      <form onSubmit={handleSubmit(callback)}>
        <section className="flex h-full flex-col items-center justify-center gap-y-10 lg:p-8">
          <div className="text-center">
            <CheckCircleIcon className="inline-block h-24 w-auto stroke-1 text-success" />
            <h1 className="text-center text-3xl font-bold">
              {t(`setup.final_${setupPhase || "setup"}`)}
            </h1>
          </div>

          <h4 className="rounded-xl border border-warning bg-yellow-900 p-4 text-center font-semibold text-warning lg:w-2/5">
            {t("setup.final_seedwords")}
          </h4>

          {seedWords && (
            <ol className="flex h-[26rem] w-full list-decimal flex-col flex-wrap gap-x-8 rounded-3xl bg-default pl-20 pt-3 font-bold lowercase lg:w-2/5">
              {words.map((word, i) => {
                return (
                  <li key={i} className="my-3 pl-2">
                    {word}
                  </li>
                );
              })}
            </ol>
          )}

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

          <article className="justify-cente flex flex-col items-center">
            <Button
              type="submit"
              isDisabled={!isValid}
              color="primary"
              className="rounded-full px-8 py-6 font-semibold"
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
