import { ChangeEvent, FC, FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import SelectOption from "../../container/SelectOption/SelectOption";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupPhase } from "../../models/setup.model";
import { ReactComponent as ArrowRight } from "../../assets/arrow-sm-right.svg";

export type Props = {
  setupPhase: SetupPhase;
  callback: (setupmode: SetupPhase) => void;
};

const ChooseSetup: FC<Props> = ({ setupPhase, callback }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SetupPhase>(SetupPhase.NULL);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    callback(selected);
  };

  const changeHandler = (e: ChangeEvent<HTMLFormElement>) => {
    setSelected(e.target.value);
  };

  return (
    <SetupContainer>
      <h2 className="m-2 text-center text-lg font-bold">
        {t("setup.setupoptions")}
      </h2>
      <form
        className="flex h-full flex-col flex-wrap items-center justify-center"
        onSubmit={submitHandler}
        onChange={changeHandler}
      >
        <div>
          {setupPhase === SetupPhase.RECOVERY && (
            <SelectOption
              id="recovery"
              radioGroup="setup"
              value={SetupPhase.RECOVERY}
            >
              {t("setup.recoverblitz")}
            </SelectOption>
          )}
          {setupPhase === SetupPhase.UPDATE && (
            <SelectOption
              id="update"
              radioGroup="setup"
              value={SetupPhase.UPDATE}
            >
              {t("setup.updateblitz")}
            </SelectOption>
          )}
          {setupPhase === SetupPhase.MIGRATION && (
            <SelectOption
              id="migration"
              radioGroup="setup"
              value={SetupPhase.MIGRATION}
            >
              {t("setup.migrateblitz")}
            </SelectOption>
          )}
          <SelectOption id="setup" radioGroup="setup" value={SetupPhase.SETUP}>
            {t("setup.setupblitz")}
          </SelectOption>
          <SelectOption
            id="shutdown"
            radioGroup="setup"
            value={SetupPhase.NULL}
          >
            {t("setup.shutdown")}
          </SelectOption>
        </div>
        <div className="mt-auto">
          <button type="submit" className="bd-button p-4">
            Continue
            <ArrowRight className="inline h-6 w-6" />
          </button>
        </div>
      </form>
    </SetupContainer>
  );
};

export default ChooseSetup;
