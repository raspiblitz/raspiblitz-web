import CustomRadio from "./CustomRadio";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupPhase } from "@/models/setup.model";
import {
  ArrowUturnLeftIcon,
  ArrowUpCircleIcon,
  ArrowsRightLeftIcon,
  ArrowDownTrayIcon,
  PowerIcon,
} from "@heroicons/react/24/outline";
import { RadioGroup } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";

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
    callback(selected);
  };

  return (
    <SetupContainer>
      <section className="flex flex-col items-center justify-center">
        <Headline>{t("setup.setupmenu.lets_setup")}</Headline>

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
                  icon={<ArrowUturnLeftIcon />}
                  text={t("setup.recoverblitz")}
                ></CustomRadio>
              )}
              {setupPhase === SetupPhase.UPDATE && (
                <CustomRadio
                  id="update"
                  radioGroup="setup"
                  value={SetupPhase.UPDATE}
                  icon={<ArrowUpCircleIcon />}
                  text={t("setup.updateblitz")}
                ></CustomRadio>
              )}
              {setupPhase === SetupPhase.MIGRATION && (
                <CustomRadio
                  id="migration"
                  radioGroup="setup"
                  value={SetupPhase.MIGRATION}
                  icon={<ArrowsRightLeftIcon />}
                  text={t("setup.migrateblitz")}
                ></CustomRadio>
              )}
              <CustomRadio
                id="setup"
                radioGroup="setup"
                value={SetupPhase.SETUP}
                icon={<ArrowDownTrayIcon />}
                text={t("setup.setupblitz")}
              ></CustomRadio>
              <CustomRadio
                id="shutdown"
                radioGroup="setup"
                value={SetupPhase.NULL}
                icon={<PowerIcon />}
                iconColor="text-red-500"
                text={t("settings.shutdown")}
              ></CustomRadio>
            </RadioGroup>
          </div>
          <Button type="submit" color="primary">
            {t("setup.continue")}
          </Button>
        </form>
      </section>
    </SetupContainer>
  );
}
