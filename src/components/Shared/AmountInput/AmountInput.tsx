import { useContext } from "react";
import type { FC } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as SwitchIcon } from "../../../assets/switch-vertical.svg";
import { AppContext } from "../../../store/app-context";
import InputField from "../InputField/InputField";

const AmountInput: FC<AmountInputProps> = (props) => {
  const { t } = useTranslation();

  const ButtonToggleUnit: FC = () => {
    const appCtx = useContext(AppContext);

    return (
      <>
        <span
          className="flex justify-center items-center w-4/12 ml-6 p-1 rounded shadow-md dark:bg-gray-600"
          onClick={appCtx.toggleUnit}
        >
          {appCtx.unit}
          <SwitchIcon className="h-5 w-5 text-black dark:text-white" />
        </span>
      </>
    );
  };

  return (
    <>
      <InputField
        {...props.register}
        type="number"
        label={t("wallet.amount")}
        errorMessage={props.errorMessage}
        value={`${props.amount}`}
        inputRightElement={<ButtonToggleUnit />}
      />
    </>
  );
};

export default AmountInput;

export interface AmountInputProps {
  amount: number;
  register: UseFormRegisterReturn;
  errorMessage?: FieldError;
}
