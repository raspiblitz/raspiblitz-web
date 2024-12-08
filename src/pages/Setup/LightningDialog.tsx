import CustomRadio from "./CustomRadio";
import BitcoinLogo from "@/assets/bitcoin-logo.svg";
import CLLogo from "@/assets/core_lightning_logo_only.png";
import LNDLogo from "@/assets/lnd.png";
import { Button } from "@/components/Button";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupLightning } from "@/models/setup.model";
import { RadioGroup } from "@nextui-org/react";
import { FormEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

type Props = {
  callback: (lightningSelect: SetupLightning) => void;
};

export type SelectFn = (value: string) => void;

const images = {
  [SetupLightning.CLIGHTNING]: CLLogo,
  [SetupLightning.LND]: LNDLogo,
  [SetupLightning.NONE]: BitcoinLogo,
  [SetupLightning.NULL]: "",
};

export default function LightningDialog({ callback }: Props) {
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
    <SetupContainer currentStep={3}>
      <section className="mt-40 flex max-w-3xl flex-col items-center justify-center lg:mt-36 lg:px-8 lg:pb-1 lg:pt-0">
        <div>
          <Headline>{t("setup.select_lightning")}</Headline>

          <p className="m-2 text-center text-secondary">
            <Trans
              i18nKey={"setup.select_lightning_help"}
              t={t}
              components={[
                <a
                  key="link"
                  href="https://docs.raspiblitz.org/docs/setup/software-setup/basic"
                  className="text-primary underline"
                  target="_blank"
                  rel="noreferrer"
                ></a>,
              ]}
            />
          </p>
        </div>

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

          <article className="flex flex-col items-center justify-center gap-10 pt-10">
            <Button
              type="submit"
              color="primary"
              isDisabled={selected === undefined}
            >
              {t("setup.continue")}
            </Button>
          </article>
        </form>
      </section>
    </SetupContainer>
  );
}
