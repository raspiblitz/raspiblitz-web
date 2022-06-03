import { FC, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowRightIcon } from "../../assets/arrow-sm-right.svg";
import { ReactComponent as PlusIcon } from "../../assets/plus.svg";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";
import { ReactComponent as XCircleIcon } from "../../assets/x-circle.svg";
import SelectOption from "../../container/SelectOption/SelectOption";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";

export type Props = {
  setupPhase: SetupPhase;
  callback: (setupmode: SetupPhase) => void;
};

const ChooseSetup: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SetupPhase | null>(null);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    if (selected !== null) {
      callback(selected);
    }
  };

  const changeHandler = (setupPhase: SetupPhase) => {
    setSelected(setupPhase);
  };

  return (
    <SetupContainer>
      <h2 className="m-2 text-center text-lg font-bold">
        {t("setup.setupoptions")}
      </h2>
      <form
        className="flex h-full flex-col flex-wrap items-center justify-center"
        onSubmit={submitHandler}
      >
        <div className="my-auto">
          {setupPhase === SetupPhase.RECOVERY && (
            <SelectOption
              id="recovery"
              radioGroup="setup"
              value={SetupPhase.RECOVERY}
              selected={selected}
              onSelectOption={changeHandler}
            >
              <RefreshIcon className="mr-1 inline h-6 w-6 align-bottom" />
              {t("setup.recoverblitz")}
            </SelectOption>
          )}
          {setupPhase === SetupPhase.UPDATE && (
            <SelectOption
              id="update"
              radioGroup="setup"
              value={SetupPhase.UPDATE}
              selected={selected}
              onSelectOption={changeHandler}
            >
              {t("setup.updateblitz")}
            </SelectOption>
          )}
          {setupPhase === SetupPhase.MIGRATION && (
            <SelectOption
              id="migration"
              radioGroup="setup"
              value={SetupPhase.MIGRATION}
              selected={selected}
              onSelectOption={changeHandler}
            >
              {t("setup.migrateblitz")}
            </SelectOption>
          )}
          <SelectOption
            id="setup"
            radioGroup="setup"
            value={SetupPhase.SETUP}
            selected={selected}
            onSelectOption={changeHandler}
          >
            <PlusIcon className="mr-1 inline h-6 w-6 align-bottom" />
            {t("setup.setupblitz")}
          </SelectOption>
          <SelectOption
            id="shutdown"
            radioGroup="setup"
            value={SetupPhase.NULL}
            selected={selected}
            onSelectOption={changeHandler}
          >
            <XCircleIcon className="mr-1 inline h-6 w-6 align-bottom" />
            {t("settings.shutdown")}
          </SelectOption>
        </div>
        <div className="mt-auto">
          <button
            type="submit"
            className="bd-button flex items-center p-2"
            disabled={selected === null}
          >
            <span className="p-2">{t("setup.continue")}</span>
            <ArrowRightIcon className="inline h-6 w-6" />
          </button>
        </div>
      </form>
    </SetupContainer>
  );
};

export default ChooseSetup;
