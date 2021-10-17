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
      <div className="w-1/2 flex flex-col md:flex-row justify-between mt-5">
        <button className="bd-button p-2 my-3">{t("setup.ok")}</button>
        <button className="bd-button p-2 my-3">{t("settings.cancel")}</button>
      </div>
    </SetupContainer>
  );
};

export default FreshSetup;
