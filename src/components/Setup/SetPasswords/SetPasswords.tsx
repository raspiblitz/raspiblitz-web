import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../../container/SetupContainer/SetupContainer";

const SetPasswords: FC = (props) => {
  const { t } = useTranslation();
  return (
    <SetupContainer>
      <div className="whitespace-pre-line text-center">
        {t("setup.passwords.infotext")}
      </div>
      <div className="my-3 flex flex-col items-center justify-between">
        <div className="my-3 flex w-2/3 flex-col justify-between">
          <label className="label-underline">
            {t("setup.passwords.pass_a")}
          </label>
          <input type="password" className="input-underline" />
        </div>
        <div className="my-3 flex w-2/3 flex-col justify-between">
          <label className="label-underline">
            {t("setup.passwords.pass_b")}
          </label>
          <input type="password" className="input-underline" />
        </div>
        <div className="my-3 flex w-2/3 flex-col justify-between">
          <label className="label-underline">
            {t("setup.passwords.pass_c")}
          </label>
          <input type="password" className="input-underline" />
        </div>
      </div>
    </SetupContainer>
  );
};

export default SetPasswords;
