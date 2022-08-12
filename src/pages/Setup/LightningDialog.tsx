import { FC, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as ArrowRightIcon } from "../../assets/arrow-sm-right.svg";
import SelectOption from "../../container/SelectOption/SelectOption";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupLightning } from "../../models/setup.model";
import { ReactComponent as XCircleIcon } from "../../assets/x-circle.svg";
import CLNLogoDark from "../../assets/core-lightning-dark.png";
import CLNLogoLight from "../../assets/core-lightning-light.png";
import LNDLogo from "../../assets/lnd.png";
import { AppContext } from "../../context/app-context";

export interface InputData {
  callback: (lightningSelect: SetupLightning) => void;
}

const LightningDialog: FC<InputData> = ({ callback }) => {
  const { darkMode } = useContext(AppContext);
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SetupLightning | null>(null);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (selected !== null) {
      callback(selected);
    }
  };

  const changeHandler = (setupLightning: SetupLightning) => {
    setSelected(setupLightning);
  };

  return (
    <SetupContainer>
      <h2 className="m-2 text-center text-lg font-bold">
        {t("setup.select_lightning")}
      </h2>
      <form
        className="flex h-full flex-col flex-wrap items-center justify-center"
        onSubmit={submitHandler}
      >
        <div className="w-full text-center md:w-1/2">
          <SelectOption
            id="lnd"
            radioGroup="setup"
            value={SetupLightning.LND}
            selected={selected}
            onSelectOption={changeHandler}
          >
            <img src={LNDLogo} alt="LND Logo" className="h-16 w-20" />
          </SelectOption>
          <SelectOption
            id="clightning"
            radioGroup="setup"
            value={SetupLightning.CLIGHTNING}
            selected={selected}
            onSelectOption={changeHandler}
          >
            <img
              src={darkMode ? CLNLogoDark : CLNLogoLight}
              alt="Core Lightning Logo"
              className="h-20 w-40 transition-all"
            />
          </SelectOption>
          <SelectOption
            id="none"
            radioGroup="setup"
            value={SetupLightning.NONE}
            selected={selected}
            onSelectOption={changeHandler}
          >
            {t("setup.select_bitcoin")}
          </SelectOption>
          <SelectOption
            id="cancel"
            radioGroup="setup"
            value={SetupLightning.NULL}
            selected={selected}
            onSelectOption={changeHandler}
          >
            <XCircleIcon className="mr-1 inline h-6 w-6 align-bottom" />
            {t("setup.cancel")}
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

export default LightningDialog;
