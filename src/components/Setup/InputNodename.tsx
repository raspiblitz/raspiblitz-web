import { FC, useState, ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "../../container/SetupContainer/SetupContainer";

export interface Callback {
  callback: (nodename: string) => void;
}

const InputNodename: FC<Callback> = (props) => {
  const [Nodename, setNodename] = useState("");

  const { t } = useTranslation();
  // later use {t("setup.set_lang")}

  const changeNodenameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNodename(event.target.value);
  };

  const Cancel = () => {
    props.callback("");
  };

  const Continue = () => {
    // check is password is valid
    if (Nodename == "") {
      alert("Nodename cannot be empty.");
      return;
    }
    if (Nodename.length < 4) {
      alert("Password needs to be at least 4 characters long.");
      return;
    }
    if (!Nodename.match(/^[a-zA-Z0-9]*$/)) {
      alert("Nodename should just contain characters & numbers.");
      return;
    }

    props.callback(Nodename);
  };

  return (
    <SetupContainer>
      <div className="text-center">
        <div className="text-center">Input Nodename</div>
        <div className="w-full py-1 md:w-10/12">
          <label htmlFor="oldpw" className="label-underline">
            Node Name
          </label>
          <input
            id="oldpw"
            className="input-underline w-full"
            type="text"
            value={Nodename}
            onChange={changeNodenameHandler}
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

export default InputNodename;
