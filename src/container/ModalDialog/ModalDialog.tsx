import { FC, useCallback, useEffect } from "react";
import { ReactComponent as XIcon } from "../../assets/X.svg";
import ModalBackground from "../ModalBackground/ModalBackground";

export const disableScroll = {
  on: () => document.body.classList.add("overflow-y-hidden"),
  off: () => document.body.classList.remove("overflow-y-hidden"),
};

type Props = {
  children?: React.ReactNode;
  closeable?: boolean;
  close: () => void;
};

const ModalDialog: FC<Props> = ({ closeable = true, close, children }) => {
  const closeModal = useCallback(() => {
    close();
    disableScroll.off();
  }, [close]);

  // close Modal on Esc
  const closeOnEsc = useCallback(
    (event: KeyboardEvent) => {
      if (closeable && event.key === "Escape") {
        closeModal();
      }
    },
    [closeModal, closeable]
  );

  useEffect(() => {
    disableScroll.on();
    window.addEventListener("keydown", closeOnEsc);
    return () => {
      window.removeEventListener("keydown", closeOnEsc);
      disableScroll.off();
    };
  }, [closeable, close, closeModal, closeOnEsc]);

  return (
    <ModalBackground>
      <div className="xl:max-w-screen-sm mx-5 flex h-auto max-h-[100%] w-4/5 flex-col overflow-y-auto rounded-lg bg-white pb-4 text-center dark:bg-gray-800 dark:text-white lg:w-1/2 xl:w-2/5">
        <div className="flex pr-2 pt-1">
          {closeable && (
            <button
              onClick={closeModal}
              className="ml-auto mt-1 flex h-7 w-7 items-end"
            >
              <XIcon className="h-full w-full" />
            </button>
          )}
        </div>
        <div className="px-5">{children}</div>
      </div>
    </ModalBackground>
  );
};

export default ModalDialog;
