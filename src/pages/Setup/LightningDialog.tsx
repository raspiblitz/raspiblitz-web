import { FC, FormEvent, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import CLLogoDark from "@/assets/core-lightning-dark.png";
import CLLogoLight from "@/assets/core-lightning-light.png";
import LNDLogo from "@/assets/lnd.png";
import { AppContext } from "@/context/app-context";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupLightning } from "@/models/setup.model";
import { Button, RadioGroup } from "@nextui-org/react";
import BitcoinLogo from "@/assets/bitcoin-logo.svg";

import CustomRadio from "./CustomRadio";

export interface InputData {
  callback: (lightningSelect: SetupLightning) => void;
}
export type SelectFn = (value: string) => void;

const images = {
  [SetupLightning.CLIGHTNING]: { dark: CLLogoDark, light: CLLogoLight },
  [SetupLightning.LND]: { dark: LNDLogo, light: LNDLogo },
  [SetupLightning.NONE]: { dark: BitcoinLogo, light: BitcoinLogo },
  [SetupLightning.NULL]: { dark: "", light: "" },
};

const LightningDialog: FC<InputData> = ({ callback }) => {
  const { darkMode } = useContext(AppContext);
  const { t } = useTranslation();
  const [selected, setSelected] = useState<SetupLightning | undefined>(
    undefined,
  );

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();

    if (!selected) return;
    callback(selected);
  };

  return (
    <SetupContainer>
      <section className="flex flex-col items-center justify-center">
        <h1 className="m-2 text-center text-3xl font-bold">
          {t("setup.select_lightning")}
        </h1>
        {/* 
        TODO: https://github.com/raspiblitz/raspiblitz-web/issues/702
        <p className="m-2 text-center text-secondary">
          What the difference? Watch this <a href="https://youtube.com/XXXXXX">short video</a> to learn more.
        </p> */}
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
              {[
                SetupLightning.LND,
                SetupLightning.CLIGHTNING,
                SetupLightning.NONE,
              ].map((lightning) => (
                <CustomRadio
                  key={lightning}
                  id={lightning}
                  radioGroup="setup"
                  value={lightning}
                  text={t(`setup.${lightning}`)}
                  description={t(`setup.${lightning}_description`)}
                  image={images[lightning][darkMode ? "dark" : "light"]}
                ></CustomRadio>
              ))}
            </RadioGroup>
          </div>

          <Button
            type="submit"
            color="primary"
            className="mt-8 rounded-full px-8 py-6 font-semibold"
          >
            {t("setup.continue")}
          </Button>
        </form>
      </section>
    </SetupContainer>
  );
};

export default LightningDialog;
