import { AppContext, Unit } from "@/context/app-context";
import { convertBtcToSat, convertSatToBtc, formatAmount } from "@/utils/format";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, FC, useContext, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export type Props = {
  amount?: number;
  register: UseFormRegisterReturn;
  errorMessage?: FieldError;
  disabled?: boolean;
};

const AmountInput: FC<Props> = ({
  amount,
  register,
  errorMessage,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [amountInput, setAmountInput] = useState<string>(
    amount ? `${amount}` : "",
  );
  const { unit, toggleUnit } = useContext(AppContext);

  const toggleHandler = () => {
    let formattedValue = amountInput;
    if (unit === Unit.BTC && formattedValue) {
      formattedValue = new Intl.NumberFormat("en-US").format(
        convertBtcToSat(+formattedValue),
      );
    } else {
      // remove separators
      formattedValue = formattedValue.replace(/,|\./g, "");
      if (formattedValue) {
        formattedValue = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 8,
        }).format(convertSatToBtc(parseInt(formattedValue))!);
      }
    }
    setAmountInput(formattedValue);
    toggleUnit();
    register.onChange({ target: { value: formattedValue } });
  };

  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    let selectionStart = e.target.selectionStart;
    let selectionEnd = e.target.selectionEnd;
    value = formatAmount(value, unit);
    // do not shift position of cursor if comma was added
    if (value.length > e.target.value.length) {
      selectionStart = selectionStart ? selectionStart + 1 : null;
      selectionEnd = selectionEnd ? selectionEnd + 1 : null;
    }
    setAmountInput(value);
    e.target.value = value.replace(/,/g, "");
    await register.onChange(e);
    e.target.setSelectionRange(selectionStart, selectionEnd);
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
          disabled={disabled}
        />
        <span
          className="ml-6 flex w-4/12 items-center justify-center rounded p-1 shadow-md bg-gray-600"
          onClick={toggleHandler}
        >
          {unit}
          <ArrowsRightLeftIcon className="ml-1 h-5 w-5 text-white" />
        </span>
      </div>

      <p
        className={`
        text-left text-sm text-red-500
        ${errorMessage ? "" : "invisible"}`}
      >
        {errorMessage?.message || "error"}
      </p>
    </>
  );
};

export default AmountInput;
