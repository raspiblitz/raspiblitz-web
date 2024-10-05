import type { HTMLInputTypeAttribute, ReactElement, Ref } from "react";
import { forwardRef } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const InputField = forwardRef(
  (
    {
      autoFocus,
      errorMessage,
      inputRightAddon,
      inputRightElement,
      label,
      name,
      onChange,
      placeholder,
      textAlign,
      type,
      value,
      ...rest
    }: Omit<InputFieldProps, "ref">,
    ref: Ref<HTMLInputElement>,
  ) => {
    return (
      <>
        <label className="label-underline" htmlFor={name}>
          {label}
        </label>

        <div className="flex">
          <input
            {...rest}
            autoFocus={autoFocus}
            className={` ${errorMessage ? "input-error" : "input-underline"} ${textAlign === "right" || type === "number" ? "text-right" : ""} ${inputRightAddon || inputRightElement ? "w-7/12" : ""} `}
            id={name}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            ref={ref}
            type={type}
            value={value}
          />

          {inputRightAddon && (
            <div className="w-5/12 break-words text-sm">{inputRightAddon}</div>
          )}

          {inputRightElement}
        </div>

        <p
          className={`text-left text-sm text-red-500 ${errorMessage ? "" : "invisible"}`}
        >
          {errorMessage?.message || "error"}
        </p>
      </>
    );
  },
);

export default InputField;

export interface InputFieldProps extends UseFormRegisterReturn {
  autoFocus?: boolean;
  label: string;
  errorMessage?: FieldError;
  placeholder?: string;
  value?: string;
  inputRightAddon?: string;
  inputRightElement?: ReactElement | string;
  textAlign?: "right";
  type?: HTMLInputTypeAttribute;
}
