import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { FC } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

type Props = {
  children?: React.ReactNode;
  // closeable?: boolean;
  closeFunc: () => void;
  backFunc?: () => void;
  submitFunc?: () => void;
  title: string;
  submitLabel?: string;
};

const Modal: FC<Props> = ({
  // closeable = true,
  closeFunc,
  backFunc,
  children,
  title,
  submitLabel,
  submitFunc,
}) => {
  const { t } = useTranslation();

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => closeFunc()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform  overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    submitFunc && submitFunc();
                  }}
                >
                  <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                    <button
                      type="button"
                      className="rounded-md bg-white dark:bg-zinc-900 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => closeFunc()}
                    >
                      <span className="sr-only">{t("navigation.cancel")}</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="bg-white px-4 pb-4 pt-5 dark:bg-gray-800 dark:text-white sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                        >
                          {title}
                        </Dialog.Title>

                        <div className="mt-2">{children}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-zinc-900 px-4 py-3 sm:flex justify-between sm:px-6">
                    {backFunc ? (
                      <button
                        type="reset"
                        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                        onClick={backFunc}
                        ref={cancelButtonRef}
                      >
                        {t("navigation.back")}
                      </button>
                    ) : (
                      <span>
                        {/* flexbox needs an empty placeholder here to keep the layout */}
                      </span>
                    )}

                    <div className="sm:flex sm:flex-row-reverse">
                      {submitLabel && (
                        <button
                          type="submit"
                          className="inline-flex w-full bg-yellow-500 hover:bg-yellow-400 justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                        >
                          {submitLabel}
                        </button>
                      )}

                      <button
                        type="reset"
                        className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto dark:text-white dark:bg-gray-500"
                        onClick={() => closeFunc()}
                        ref={cancelButtonRef}
                      >
                        {t("navigation.cancel")}
                      </button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
