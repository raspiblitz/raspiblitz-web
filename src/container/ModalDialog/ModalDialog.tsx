import ModalBackground from "../ModalBackground/ModalBackground";
import { ReactComponent as XIcon } from "../../assets/X.svg";
import { FC, useEffect } from "react";

const ModalDialog: FC<ModalDialogProps> = (props) => {
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      // close on Esc
      if (event.key === "Escape") {
        props.close();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [props]);

  return (
    <ModalBackground>
      <div className="w-4/5 h-auto lg:w-1/2 xl:w-2/5 xl:max-w-screen-sm bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-800 dark:text-white">
        <div className="flex pr-2 pt-1">
          <button
            onClick={props.close}
            className="flex items-end ml-auto h-7 w-7 mt-1"
          >
            <XIcon className="w-full h-full" />
          </button>
        </div>
        <div className="px-5">{props.children}</div>
      </div>
    </ModalBackground>
  );
};

export default ModalDialog;

export interface ModalDialogProps {
  close: () => void;
}
