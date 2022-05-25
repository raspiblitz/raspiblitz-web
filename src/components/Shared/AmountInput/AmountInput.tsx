import { ChangeEvent, FC, useContext, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReactComponent as SwitchIcon } from "../../../assets/switch-vertical.svg";
import { AppContext, Unit } from "../../../store/app-context";
import { convertBtcToSat, convertSatToBtc } from "../../../util/format";

export type Props = {
  amount: number;
  register: UseFormRegisterReturn;
  errorMessage?: FieldError;
  onChange: any; // TODO: change to fititng function
};

const AmountInput: FC<Props> = ({
  amount,
  register,
  errorMessage,
  onChange,
}) => {
  const { t } = useTranslation();
  const [amountInput, setAmountInput] = useState<string>(
    amount ? "" + amount : ""
  );
  const { unit, toggleUnit } = useContext(AppContext);

  const toggleHandler = () => {
    let formattedValue = amountInput;
    if (unit === Unit.BTC) {
      formattedValue = new Intl.NumberFormat("en-US").format(
        convertBtcToSat(+formattedValue)!
      );
      setAmountInput(formattedValue);
    } else {
      formattedValue = formattedValue.replace(/,|\./g, "");
      console.log(+convertSatToBtc(+formattedValue)!);
      formattedValue = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 8,
      }).format(convertSatToBtc(parseInt(formattedValue))!);
      setAmountInput(formattedValue);
    }
    toggleUnit();
    onChange({ target: { value: formattedValue } });
  };

  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9.,]/, "");
    if (unit === Unit.SAT) {
      value = value.replace(/,|\./g, "");
      value = new Intl.NumberFormat("en-US").format(+value);
    } else {
      // remove commas and replace ".." with "."
      value = value.replace(/,/g, "").replace(/\.\./g, ".");
      const output = value.split(".");
      value = output.shift() + (output.length ? "." + output.join("") : "");
    }
    setAmountInput(value);
    onChange({ target: { value } });
  };

  return (
    <>
      <label className="label-underline" htmlFor={register.name}>
        {t("wallet.amount")}
      </label>
      <div className="flex">
        <input
          {...register}
          id={register.name}
          className={`${errorMessage ? "input-error" : "input-underline"}`}
          type="text"
          value={amountInput}
          onChange={onChangeHandler}
        />
        <span
          className="ml-6 flex w-4/12 items-center justify-center rounded p-1 shadow-md dark:bg-gray-600"
          onClick={toggleHandler}
        >
          {unit}
          <SwitchIcon className="h-5 w-5 text-black dark:text-white" />
        </span>
      </div>

      {errorMessage && (
        <p className="text-left text-red-500">{errorMessage.message}</p>
      )}
    </>
  );
};

export default AmountInput;
