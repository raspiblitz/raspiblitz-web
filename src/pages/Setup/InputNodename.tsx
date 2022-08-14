import { ArrowSmRightIcon, XIcon } from "@heroicons/react/outline";
import { ChangeEvent, FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import ConfirmModal from "../../components/ConfirmModal";
import InputField from "../../components/InputField";
import SetupContainer from "../../layouts/SetupContainer";

export type Props = {
  callback: (nodename: string | null) => void;
};

interface IFormInputs {
  inputNodeName: string;
}

const InputNodename: FC<Props> = ({ callback }) => {
  const [inputNodeName, setInputNodeName] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { t } = useTranslation();

  const changeNodenameHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInputNodeName(event.target.value);
  };

  const continueHandler = () => {
    callback(inputNodeName);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInputs>({
    mode: "onChange",
  });

  const handleCancel = () => {
    setShowConfirmModal(true);
  };

  const hideConfirm = () => {
    setShowConfirmModal(false);
  };

  return (
    <>
      {showConfirmModal && (
        <ConfirmModal
          confirmText={`${t("setup.cancel_setup")}?`}
          onClose={hideConfirm}
          onConfirm={() => callback(null)}
        />
      )}
      <SetupContainer>
        <section className="flex h-full flex-col items-center justify-center p-8">
          <h2 className="text-center text-lg font-bold">
            {t("setup.nodename_input")}
          </h2>
          <form
            onSubmit={handleSubmit(continueHandler)}
            className="flex h-full w-full flex-col py-1 md:w-10/12"
          >
            <article className="m-auto md:w-1/2">
              <InputField
                {...register("inputNodeName", {
                  required: t("setup.nodename_error_empty"),
                  onChange: changeNodenameHandler,
                  pattern: {
                    value: /^[a-zA-Z0-9]*$/,
                    message: t("setup.nodename_err_chars"),
                  },
                  minLength: {
                    value: 4,
                    message: t("setup.nodename_err_min_length"),
                  },
                  maxLength: {
                    value: 32,
                    message: t("setup.nodename_err_max_length"),
                  },
                })}
                label={t("setup.nodename_name")}
                errorMessage={errors.inputNodeName}
              />
            </article>
            <article className="mt-10 flex flex-col items-center justify-center gap-10 md:flex-row">
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center rounded  bg-red-500 px-2 text-white shadow-xl hover:bg-red-400 disabled:bg-gray-400"
              >
                <XIcon className="inline h-6 w-6" />
                <span className="p-2">{t("setup.cancel")}</span>
              </button>
              <button
                disabled={!isValid}
                type="submit"
                className="bd-button flex items-center px-2 disabled:bg-gray-400"
              >
                <span className="p-2">Continue</span>
                <ArrowSmRightIcon className="inline h-6 w-6" />
              </button>
            </article>
          </form>
        </section>
      </SetupContainer>
    </>
  );
};

export default InputNodename;
