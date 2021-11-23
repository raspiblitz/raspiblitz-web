import { forwardRef } from "react";
import type { Ref } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import { HTMLInputTypeAttribute } from "react";

const InputField = forwardRef(
  (
    {
      name,
      label,
      errorMessage,
      placeholder,
      value,
      inputRightAddon,
      type,
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
             `}
          />

          {inputRightAddon && (
            <div className="w-5/12 text-sm break-words">{inputRightAddon}</div>
          )}
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage.message}</p>}
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
  type?: HTMLInputTypeAttribute;
}
