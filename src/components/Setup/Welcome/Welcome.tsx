import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../../container/SetupContainer/SetupContainer";
import I18nDropdown from "../../Settings/I18nBox/I18nBox";

const Welcome: FC = () => {
  const { t } = useTranslation();

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{t("setup.set_lang")}</div>
        <div className="flex justify-center">
          <I18nDropdown />
        </div>
        <button className="bd-button my-5 p-2">{t("setup.continue")}</button>
      </div>
    </SetupContainer>
  );
};

export default Welcome;
