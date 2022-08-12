import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../layouts/SetupContainer";
import { SetupPhase } from "../../models/setup.model";
import { ReactComponent as RefreshIcon } from "../../assets/refresh.svg";

export type Props = {
  setupPhase: SetupPhase;
  seedWords: string;
  callback: () => void;
};

const FinalDialog: FC<Props> = ({ setupPhase, seedWords, callback }) => {
  const { t } = useTranslation();
  const words = seedWords.split(" ");
  const partOne = words.slice(0, 8);
  const partTwo = words.slice(8, 16);
  const partThree = words.slice(16, 24);

  return (
    <SetupContainer>
      <section className="flex h-full flex-col items-center justify-center md:p-8">
        <h2 className="text-center text-lg font-bold">
          {t(`setup.final_${setupPhase || "setup"}`)}
        </h2>
        {seedWords && (
          <article className="my-auto flex flex-col items-center justify-center">
            <h4 className="my-2 font-bold">{t("setup.final_seedwords")}</h4>
            <div className="flex flex-row gap-4 md:gap-10">
              <div className="flex flex-col">
                {partOne.map((word, i) => {
                  return (
                    <div key={i} className="input-underline py-2">
                      {i + 1} {word}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col">
                {partTwo.map((word, i) => {
                  return (
                    <div key={i} className="input-underline py-2">
                      {i + 9} {word}
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col">
                {partThree.map((word, i) => {
                  return (
                    <div key={i} className="input-underline py-2">
                      {i + 17} {word}
                    </div>
                  );
                })}
              </div>
            </div>
          </article>
        )}
        <article className="justify-cente mt-4 flex flex-col items-center">
          <div className="my-4 text-center text-sm">
            {t("setup.final_info_reboot")}
          </div>
          <button onClick={() => callback()} className="bd-button p-2">
            <RefreshIcon className="mr-1 inline h-6 w-6 align-top" />
            {t("setup.final_do_reboot")}
          </button>
        </article>
      </section>
    </SetupContainer>
  );
};

export default FinalDialog;
