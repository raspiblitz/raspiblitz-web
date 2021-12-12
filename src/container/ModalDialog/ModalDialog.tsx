import { FC, useCallback, useEffect } from "react";
import { ReactComponent as XIcon } from "../../assets/X.svg";
import ModalBackground from "../ModalBackground/ModalBackground";

export const disableScroll = {
  on: () => document.body.classList.add("overflow-y-hidden"),
  off: () => document.body.classList.remove("overflow-y-hidden"),
};

type Props = {
  close: () => void;
};

const ModalDialog: FC<Props> = ({ close, children }) => {
  disableScroll.on();

  const closeModal = useCallback(() => {
    close();
    disableScroll.off();
  }, [close]);

  useEffect(() => {
    const closeOnEsc = (event: KeyboardEvent) => {
      // close on Esc
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", closeOnEsc);
    return () => {
      window.removeEventListener("keydown", closeOnEsc);
    };
  }, [close, closeModal]);

  return (
    <ModalBackground>
      <div className="w-4/5 h-auto lg:w-1/2 xl:w-2/5 xl:max-w-screen-sm bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-700 dark:text-white">
        <div className="flex pr-2 pt-1">
          <button
            onClick={closeModal}
            className="flex items-end ml-auto h-7 w-7 mt-1"
          >
            <XIcon className="w-full h-full" />
          </button>
        </div>
        <div className="px-5">{children}</div>
      </div>
    </ModalBackground>
  );
};

export default ModalDialog;
