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
      PasswordName = "Password A";
      Headline = "Set your new Admin-Password (Password A)";
      Details = "Use this password for login to your RaspiBlitz.";
      break;
    case "b":
      PasswordName = "Password B";
      Headline = "Set your new App-Password (Password B)";
      Details =
        "Use this password for additional Apps you can install on your RaspiBlitz.";
      break;
    case "c":
      PasswordName = "Password C";
      Headline = "Set your new Lightning-Wallet-Password (Password C)";
      Details = "Use this password to unlock your Lightning Wallet.";
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
      alert("Password cannot be empty.");
      return;
    }
    if (password.length < 8) {
      alert("Password needs to be at least 8 characters long.");
      return;
    }
    if (!password.match(/^[a-zA-Z0-9]*$/)) {
      alert("Password should just contain characters & numbers.");
      return;
    }
    if (password !== passwordRepeat) {
      alert("Password entries are not the same.");
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
            {PasswordName} (Repeat)
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
          Cancel
        </button>
        &nbsp;
        <button onClick={() => Continue()} className="bd-button my-5 p-2">
          OK
        </button>
      </div>
    </SetupContainer>
  );
};

export default InputPassword;
