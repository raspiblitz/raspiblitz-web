import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../../container/SetupContainer/SetupContainer";

const UpdateRecover: FC<UpdateRecoverProps> = (props) => {
  const { t } = useTranslation();
  const infoText =
    props.type === "UPDATE"
      ? t("setup.update.infotext", { version: props.version })
      : t("setup.recovery.infotext");

  const startText =
    props.type === "UPDATE"
      ? t("setup.update.start")
      : t("setup.recovery.start");
  return (
    <SetupContainer>
      {props.type}
      <div className="w-1/2">{infoText}</div>
      <div className="mt-5 flex w-1/2 flex-col justify-between md:flex-row">
        <button className="bd-button my-3 whitespace-pre-line p-2">
          {startText}
        </button>
        <button className="bd-button my-3 whitespace-pre-line p-2">
          {t("setup.other_options")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default UpdateRecover;

export interface UpdateRecoverProps {
  type: "UPDATE" | "RECOVER";
  version?: string;
}
