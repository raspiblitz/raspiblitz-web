import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import { Button, RadioGroup } from "@nextui-org/react";
import {
  ArrowLeftRight,
  CircleArrowUp,
  Download,
  Power,
  RotateCcw,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import CustomRadio from "./CustomRadio";

export type Props = {
  setupPhase: SetupPhase;
  callback: (setupmode: SetupPhase) => void;
};

export type SelectFn = (value: string) => void;

export default function SetupMenu({ setupPhase, callback }: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SetupPhase>(SetupPhase.NULL);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    callback(selected as SetupPhase);
  };

  return (
    <SetupContainer>
      <section className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-center text-3xl font-bold">
          {t("setup.setupmenu.lets_setup")}
        </h1>
        <p className="m-2 text-center text-secondary">
          {t("setup.setupmenu.setup_time")}
        </p>
        <form
          className="flex h-full flex-col flex-wrap items-center justify-center"
          onSubmit={submitHandler}
        >
          <div className="mt-4">
            <RadioGroup
              value={selected}
              classNames={{ wrapper: "gap-6" }}
              onValueChange={setSelected as SelectFn}
            >
              {setupPhase === SetupPhase.RECOVERY && (
                <CustomRadio
                  id="recovery"
                  radioGroup="setup"
                  value={SetupPhase.RECOVERY}
                  icon={<RotateCcw />}
                  text={t("setup.recoverblitz")}
                ></CustomRadio>
              )}
              {setupPhase === SetupPhase.UPDATE && (
                <CustomRadio
                  id="update"
                  radioGroup="setup"
                  value={SetupPhase.UPDATE}
                  icon={<CircleArrowUp />}
                  text={t("setup.updateblitz")}
                ></CustomRadio>
              )}
              {setupPhase === SetupPhase.MIGRATION && (
                <CustomRadio
                  id="migration"
                  radioGroup="setup"
                  value={SetupPhase.MIGRATION}
                  icon={<ArrowLeftRight />}
                  text={t("setup.migrateblitz")}
                ></CustomRadio>
              )}
              <CustomRadio
                id="setup"
                radioGroup="setup"
                value={SetupPhase.SETUP}
                icon={<Download />}
                text={t("setup.setupblitz")}
              ></CustomRadio>
              <CustomRadio
                id="shutdown"
                radioGroup="setup"
                value={SetupPhase.NULL}
                icon={<Power />}
                iconColor="text-red-500"
                text={t("settings.shutdown")}
              ></CustomRadio>
            </RadioGroup>
          </div>
          <div className="mt-auto">
            <Button
              type="submit"
              className="mt-8 flex items-center rounded-full bg-primary px-4 py-6 font-semibold"
              disabled={selected === null}
            >
              <span className="p-2">{t("setup.continue")}</span>
            </Button>
          </div>
        </form>
      </section>
    </SetupContainer>
  );
}
