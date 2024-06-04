import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { FC } from "react";
import { useTranslation } from "react-i18next";

export type Props = {
  setupPhase: SetupPhase;
  callback: (start: boolean) => void;
};

const RecoveryDialog: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();

  let headline: string = "";
  switch (setupPhase) {
    case SetupPhase.RECOVERY:
      headline = t("setup.start_recovery");
      break;
    case SetupPhase.UPDATE:
      headline = t("setup.start_update");
      break;
  }

  return (
    <SetupContainer>
      <section className="flex h-full max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
        <Headline>{headline}</Headline>

        <article className="flex flex-col items-center justify-center gap-10">
          <Button onClick={() => callback(true)} color="primary">
            {t("setup.yes")}
          </Button>
          <Button
            onClick={() => callback(false)}
            color="secondary"
            variant="light"
          >
            {t("setup.other_options")}
          </Button>
        </article>
      </section>
    </SetupContainer>
  );
};

export default RecoveryDialog;
