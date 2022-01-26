import type { FC } from "react";
import { useContext } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as SwitchIcon } from "../../../assets/switch-vertical.svg";
import { AppContext } from "../../../store/app-context";
import InputField from "../InputField/InputField";

export type Props = {
  amount: number;
  register: UseFormRegisterReturn;
  errorMessage?: FieldError;
};

const AmountInput: FC<Props> = ({ amount, register, errorMessage }) => {
  const { t } = useTranslation();

  const ButtonToggleUnit: FC = () => {
    const { unit, toggleUnit } = useContext(AppContext);

    return (
      <>
        <span
          className="ml-6 flex w-4/12 items-center justify-center rounded p-1 shadow-md dark:bg-gray-600"
          onClick={toggleUnit}
        >
          {unit}
          <SwitchIcon className="h-5 w-5 text-black dark:text-white" />
        </span>
      </>
    );
  };

  return (
    <>
      <InputField
        {...register}
        type="number"
        label={t("wallet.amount")}
        errorMessage={errorMessage}
        value={`${amount}`}
        inputRightElement={<ButtonToggleUnit />}
      />
    </>
  );
};

export default AmountInput;
