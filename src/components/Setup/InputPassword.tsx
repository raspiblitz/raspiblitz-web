import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";
import { ReactComponent as ArrowRight } from "../../assets/arrow-sm-right.svg";
import { ReactComponent as X } from "../../assets/X.svg";

export type Props = {
  passwordType: string;
  callback: (password: string | null) => void;
};

const InputPassword: FC<Props> = ({ passwordType, callback }) => {
  const { t } = useTranslation();
  // later use {t("setup.set_lang")}

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  let passwordName: string = "";
  let headline: string = "";
  let details: string = "";

  switch (passwordType) {
    case "a":
      passwordName = t("setup.password_a_name");
      headline = t("setup.password_a_short");
      details = t("setup.password_a_details");
      break;
    case "b":
      passwordName = t("setup.password_b_name");
      headline = t("setup.password_b_short");
      details = t("setup.password_b_details");
      break;
    case "c":
      passwordName = t("setup.password_c_name");
      headline = t("setup.password_c_short");
      details = t("setup.password_c_details");
      break;
    default:
      console.info("Unknown passwordType .. automatic cancel");
      callback(null);
      break;
  }

  const changePasswordHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const changePasswordRepeatHandler = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordRepeat(event.target.value);
  };

  const continueHandler = () => {
    // check is password is valid
    if (!password) {
      alert(t("setup.password_error_empty"));
      return;
    }
    if (password.length < 8) {
      alert(t("setup.password_error_length"));
      return;
    }
    if (!password.match(/^[a-zA-Z0-9]*$/)) {
      alert(t("setup.password_error_chars"));
      return;
    }
    if (password !== passwordRepeat) {
      alert(t("setup.password_error_match"));
      return;
    }

    callback(password);
    setPassword("");
    setPasswordRepeat("");
  };

  const cancelHandler = () => {
    callback(null);
  };

  return (
    <SetupContainer>
      <div className="flex flex-col items-center text-center">
        <h2 className="text-center text-lg font-bold">{headline}</h2>
        <span className="text-center text-sm italic">{details}</span>
        <div className="w-full py-1 md:w-10/12">
          <label htmlFor="passfirst" className="label-underline">
            {passwordName}
          </label>
          <input
            id="passfirst"
            className="input-underline w-full"
            type="password"
            value={password}
            onChange={changePasswordHandler}
            required
          />
        </div>
        <div className="w-full py-1 md:w-10/12">
          <label htmlFor="passrepeat" className="label-underline">
            {passwordName} ({t("setup.password_repeat")})
          </label>
          <input
            id="passrepeat"
            className="input-underline w-full"
            type="password"
            value={passwordRepeat}
            onChange={changePasswordRepeatHandler}
            required
          />
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={cancelHandler}
            className="flex items-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
          >
            <X className="inline h-6 w-6" />
            <span className="p-2">{t("setup.cancel")}</span>
          </button>
          <button
            onClick={continueHandler}
            className="bd-button flex items-center px-2"
          >
            <span className="p-2 ">{t("setup.ok")}</span>
            <ArrowRight className="inline h-6 w-6" />
          </button>
        </div>
      </div>
    </SetupContainer>
  );
};

export default InputPassword;
