import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";

export type Props = {
  callback: (nodename: string | null) => void;
};

const InputNodename: FC<Props> = ({ callback }) => {
  const [nodeName, setNodename] = useState("");
  const { t } = useTranslation();
  // later use {t("setup.set_lang")}

  const changeNodenameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNodename(event.target.value);
  };

  const Continue = () => {
    // check is password is valid
    if (!nodeName) {
      alert(t("setup.nodename_error_empty"));
      return;
    }
    if (nodeName.length < 4) {
      alert(t("setup.nodename_error_length"));
      return;
    }
    if (!nodeName.match(/^[a-zA-Z0-9]*$/)) {
      alert(t("setup.nodename_error_chars"));
      return;
    }
    callback(nodeName);
  };

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{t("setup.nodename_input")}</div>
        <div className="w-full py-1 md:w-10/12">
          <label htmlFor="oldpw" className="label-underline">
            {t("setup.nodename_name")}
          </label>
          <input
            id="oldpw"
            className="input-underline w-full"
            type="text"
            value={nodeName}
            onChange={changeNodenameHandler}
            required
          />
        </div>
        <button onClick={() => callback(null)} className="bd-button my-5 p-2">
          {t("setup.cancel")}
        </button>
        &nbsp;
        <button onClick={() => Continue()} className="bd-button my-5 p-2">
          {t("setup.ok")}
        </button>
      </div>
    </SetupContainer>
  );
};

export default InputNodename;