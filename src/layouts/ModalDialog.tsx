import ModalBackground from "./ModalBackground";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FC, PropsWithChildren, useCallback, useEffect } from "react";

export const disableScroll = {
  on: () => document.body.classList.add("overflow-y-hidden"),
  off: () => document.body.classList.remove("overflow-y-hidden"),
};

type Props = {
  closeable?: boolean;
  close: () => void;
};

const ModalDialog: FC<PropsWithChildren<Props>> = ({
  closeable = true,
  close,
  children,
}) => {
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
    [closeModal, closeable],
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
      <div className="xl:max-w-screen-sm flex h-screen max-h-full w-screen flex-col overflow-y-auto rounded-lg bg-white pb-8 text-center shadow-xl dark:bg-gray-800 dark:text-white md:h-auto md:w-4/5 lg:w-1/2 xl:mx-5 xl:w-2/5">
        <div className="flex pr-2 pt-1">
          <button
            onClick={closeModal}
            className={`ml-auto mt-1 flex h-7 w-7 items-end ${
              closeable ? "" : "invisible"
            }`}
          >
            <XMarkIcon className="h-full w-full" />
          </button>
        </div>
        <div className="flex h-full flex-col justify-center px-5">
          {children}
        </div>
      </div>
    </ModalBackground>
  );
};

export default ModalDialog;
