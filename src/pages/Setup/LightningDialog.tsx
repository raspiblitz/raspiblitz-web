import CustomRadio from "./CustomRadio";
import BitcoinLogo from "@/assets/bitcoin-logo.svg";
import CLLogo from "@/assets/core_lightning_logo_only.png";
import LNDLogo from "@/assets/lnd.png";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupLightning } from "@/models/setup.model";

import { RadioGroup } from "@nextui-org/react";
import { FC, FormEvent, useState } from "react";

import { Button } from "@/components/Button";

import { Trans, useTranslation } from "react-i18next";

export interface InputData {
  callback: (lightningSelect: SetupLightning) => void;
}
export type SelectFn = (value: string) => void;

const images = {
  [SetupLightning.CLIGHTNING]: CLLogo,
  [SetupLightning.LND]: LNDLogo,
  [SetupLightning.NONE]: BitcoinLogo,
  [SetupLightning.NULL]: "",
};

const LightningDialog: FC<InputData> = ({ callback }) => {
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

        <p className="m-2 text-center text-secondary">
          <Trans
            i18nKey={"setup.select_lightning_help"}
            t={t}
            components={[
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href="https://docs.raspiblitz.org/docs/setup/software-setup/basic"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              ></a>,
            ]}
          />
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
                  image={images[lightning]}
                ></CustomRadio>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" color="primary">
            {t("setup.continue")}
          </Button>
        </form>
      </section>
    </SetupContainer>
  );
};

export default LightningDialog;
