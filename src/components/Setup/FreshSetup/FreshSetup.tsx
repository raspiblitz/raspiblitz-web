import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../../container/SetupContainer/SetupContainer";

const FreshSetup: FC = (props) => {
  const { t } = useTranslation();
  return (
    <SetupContainer>
      <div>
        <input
          type="radio"
          id="FRESHSETUP"
          name="setup"
          value="FRESHSETUP"
          className="m-4"
        />
        <label htmlFor="FRESHSETUP">{t("setup.fresh.setup")}</label>
        <br />
        <input
          type="radio"
          id="FROMBACKUP"
          name="setup"
          value="FROMBACKUP"
          className="m-4"
        />
        <label htmlFor="FROMBACKUP">{t("setup.fresh.from_backup")}</label>
        <br />
        <input
          type="radio"
          id="SHUTDOWN"
          name="setup"
          value="SHUTDOWN"
          className="m-4"
        />
        <label htmlFor="SHUTDOWN">{t("setup.fresh.shutdown")}</label>
      </div>
      <div className="mt-5 flex w-1/2 flex-col justify-between md:flex-row">
        <button className="bd-button my-3 p-2">{t("setup.ok")}</button>
        <button className="bd-button my-3 p-2">{t("settings.cancel")}</button>
      </div>
    </SetupContainer>
  );
};

export default FreshSetup;
