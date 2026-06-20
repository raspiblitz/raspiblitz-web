import { ArrowsRightLeftIcon } from "@heroicons/react/24/outline";
import { FieldError, InputGroup, Label, TextField } from "@heroui/react";
import { type FC, useContext, useRef, useState } from "react";
import type { ControllerRenderProps } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { AppContext, Unit } from "@/context/app-context";
import { convertBtcToSat, convertSatToBtc, formatAmount } from "@/utils/format";

export type Props = {
  amount?: number;
  // biome-ignore lint/suspicious/noExplicitAny: field is reused across forms with different value shapes
  field: ControllerRenderProps<any, any>;
  error?: string;
  disabled?: boolean;
};

const AmountInput: FC<Props> = ({ amount, field, error, disabled = false }) => {
  const { t } = useTranslation();
  const [amountInput, setAmountInput] = useState<string>(
    amount ? `${amount}` : "",
  );
  const { unit, toggleUnit } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleHandler = () => {
    let formattedValue = amountInput;
    if (unit === Unit.BTC && formattedValue) {
      formattedValue = new Intl.NumberFormat("en-US").format(
        convertBtcToSat(+formattedValue),
      );
    } else {
      // remove separators
      formattedValue = formattedValue.replace(/[,.]/g, "");
      if (formattedValue) {
        formattedValue = new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 8,
          // biome-ignore lint/style/noNonNullAssertion: value is expected to exist at this point
        }).format(convertSatToBtc(Number.parseInt(formattedValue, 10))!);
      }
    }
    setAmountInput(formattedValue);
    toggleUnit();
    // store the cleaned value (without grouping separators) in the form state
    field.onChange(formattedValue.replace(/,/g, ""));
  };

  // v3's TextField.onChange only provides the string value, so we read the
  // selection from the underlying input ref to preserve the caret position.
  const onChangeHandler = (rawValue: string) => {
    const input = inputRef.current;
    let selectionStart = input?.selectionStart ?? null;
    let selectionEnd = input?.selectionEnd ?? null;

    const formatted = formatAmount(rawValue, unit);
    // do not shift position of cursor if a separator was added
    if (formatted.length > rawValue.length) {
      selectionStart = selectionStart !== null ? selectionStart + 1 : null;
      selectionEnd = selectionEnd !== null ? selectionEnd + 1 : null;
    }

    setAmountInput(formatted);
    // store the cleaned value (without grouping separators) in the form state
    field.onChange(formatted.replace(/,/g, ""));

    // restore the caret position after React re-renders the controlled input
    requestAnimationFrame(() => {
      inputRef.current?.setSelectionRange(selectionStart, selectionEnd);
    });
  };

  return (
    <TextField
      className="w-full"
      isInvalid={!!error}
      isDisabled={disabled}
      value={amountInput}
      onChange={onChangeHandler}
      onBlur={field.onBlur}
      name={field.name}
    >
      <Label>{t("wallet.amount")}</Label>
      <InputGroup className="bg-tertiary">
        <InputGroup.Input ref={inputRef} type="text" />
        <InputGroup.Suffix>
          <button
            className="focus:outline-none h-full"
            type="button"
            onClick={toggleHandler}
            aria-label="toggle amount unit"
          >
            <span className="whitespace-nowrap text-small text-default-foreground">
              {unit}
              <ArrowsRightLeftIcon className="ml-1 inline-block h-5 w-5" />
            </span>
          </button>
        </InputGroup.Suffix>
      </InputGroup>
      <FieldError>{error}</FieldError>
    </TextField>
  );
};

export default AmountInput;
