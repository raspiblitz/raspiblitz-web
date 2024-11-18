import { AppContext, Unit } from "@/context/app-context";
import { convertBtcToSat, convertSatToBtc, formatAmount } from "@/utils/format";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { Input } from "@nextui-org/react";
import { ChangeEvent, FC, useContext, useState } from "react";
import type {
  FieldError,
  UseFormRegisterReturn,
  Controller,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import NumberFormat from "react-number-format";

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
    <Input
      {...register}
      label={t("wallet.amount")}
      id={register.name}
      type="text"
      className="w-full"
      classNames={{
        inputWrapper:
          "bg-tertiary group-data-[focus=true]:bg-tertiary group-data-[hover=true]:bg-tertiary",
      }}
      value={amountInput}
      onChange={onChangeHandler}
      isDisabled={disabled}
      isInvalid={!!errorMessage}
      errorMessage={errorMessage?.message}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleHandler}
          aria-label="toggle password visibility"
        >
          <span className="whitespace-nowrap text-small text-default-400">
            {unit}
            <ArrowsRightLeftIcon className="ml-1 inline-block h-5 w-5" />
          </span>
        </button>
      }
    />
  );
};

export default AmountInput;
