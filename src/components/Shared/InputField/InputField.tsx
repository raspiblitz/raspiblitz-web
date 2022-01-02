import { forwardRef } from "react";
import type { ReactElement, Ref } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import type { HTMLInputTypeAttribute } from "react";

const InputField = forwardRef(
  (
    {
      name,
      label,
      errorMessage,
      placeholder,
      value,
      inputRightAddon,
      inputRightElement,
      type,
      textAlign,
      onChange,
      ...rest
    }: InputFieldProps,
    ref: Ref<HTMLInputElement>
  ) => {
    return (
      <>
        <label className="label-underline" htmlFor={name}>
          {label}
        </label>

        <div className="flex">
          <input
            id={name}
            name={name}
            value={value}
            type={type}
            placeholder={placeholder}
            {...rest}
            ref={ref}
            onChange={onChange}
            className={`
               ${errorMessage ? "input-error" : "input-underline"}
               ${textAlign === "right" || type === "number" ? "text-right" : ""}
               ${inputRightAddon || inputRightElement ? "w-7/12" : ""}
               `}
          />

          {inputRightAddon && (
            <div className="w-5/12 text-sm break-words">{inputRightAddon}</div>
          )}

          {inputRightElement}
        </div>

        {errorMessage && (
          <p className="text-left text-red-500">{errorMessage.message}</p>
        )}
      </>
    );
  }
);

export default InputField;

export interface InputFieldProps extends UseFormRegisterReturn {
  label: string;
  errorMessage?: FieldError;
  placeholder?: string;
  value?: string;
  inputRightAddon?: string;
  inputRightElement?: ReactElement | string;
  textAlign?: "right";
  type?: HTMLInputTypeAttribute;
}
