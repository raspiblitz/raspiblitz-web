import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { SetupLightning } from "../../models/setup.model";

export interface InputData {
  callback: (lightningSelect: SetupLightning) => void;
}

const LightningDialog: FC<InputData> = (props) => {
  const { t } = useTranslation();

  // removed c-lightning until supported by dashboard
  // &nbsp;<button onClick={() => props.callback(SetupLightning.CLIGHTNING)} className="bd-button my-5 p-2">C-Lightning</button>
  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">Choose your Lightning Implementaion:</div>
        <button
          onClick={() => props.callback(SetupLightning.LND)}
          className="bd-button my-5 p-2"
        >
          LND Lightning
        </button>
        &nbsp;
        <button
          onClick={() => props.callback(SetupLightning.NONE)}
          className="bd-button my-5 p-2"
        >
          Just Bitcoin
        </button>
        <br />
        <button
          onClick={() => props.callback(SetupLightning.NULL)}
          className="bd-button my-5 p-2"
        >
          Cancel
        </button>
      </div>
    </SetupContainer>
  );
};

export default LightningDialog;
