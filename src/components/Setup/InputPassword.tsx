import { ChangeEvent, FC, useState } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";

export type Props = {
  passwordType: string;
  callback: (password: string | null) => void;
};

const InputPassword: FC<Props> = ({ passwordType, callback }) => {
  const { t } = useTranslation();
  // later use {t("setup.set_lang")}

  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  let PasswordName: string = "";
  let Headline: string = "";
  let Details: string = "";

  switch (passwordType) {
    case "a":
      PasswordName = t("setup.password_a_name");
      Headline = t("setup.password_a_short");
      Details = t("setup.password_a_details");
      break;
    case "b":
      PasswordName = t("setup.password_b_name");
      Headline = t("setup.password_b_short");
      Details = t("setup.password_b_details");
      break;
    case "c":
      PasswordName = t("setup.password_c_name");
      Headline = t("setup.password_c_short");
      Details = t("setup.password_c_details");
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

  const Continue = () => {
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

  const Cancel = () => {
    callback(null);
  };

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">{Headline}</div>
        <div className="text-center text-sm italic">{Details}</div>
        <div className="w-full py-1 md:w-10/12">
          <label htmlFor="passfirst" className="label-underline">
            {PasswordName}
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
            {PasswordName} ({t("setup.password_repeat")})
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
        <button onClick={() => Cancel()} className="bd-button my-5 p-2">
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

export default InputPassword;
