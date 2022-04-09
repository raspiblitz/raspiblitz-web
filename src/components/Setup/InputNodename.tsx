import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as X } from "../../assets/X.svg";
import { ReactComponent as ArrowRight } from "../../assets/arrow-sm-right.svg";
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

  const continueHandler = () => {
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
      <h2 className="text-center text-lg font-bold">
        {t("setup.nodename_input")}
      </h2>
      <div className="flex flex-col items-center justify-center">
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
        <div className='flex gap-2 mt-5'>
          <button
            onClick={() => callback(null)}
            className="flex items-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
          >
            <X className="inline h-6 w-6" />
            <span className="p-2">{t("setup.cancel")}</span>
          </button>
          <button
            onClick={continueHandler}
            className="bd-button flex items-center px-2"
          >
            <span className="p-2">Continue</span>
            <ArrowRight className="inline h-6 w-6" />
          </button>
        </div>
      </div>
    </SetupContainer>
  );
};

export default InputNodename;
