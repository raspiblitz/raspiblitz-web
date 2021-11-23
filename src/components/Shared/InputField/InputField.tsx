import { forwardRef } from "react";
import type { Ref } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

const InputField = forwardRef(
  (
    {
      name,
      label,
      errorMessage,
      placeholder,
      onChange,
      ...rest
    }: InputFieldProps,
    ref: Ref<HTMLInputElement>
  ) => {
    console.log("errorMessage", errorMessage);
    return (
      <>
        <label className="label-underline" htmlFor={name}>
          {label}
        </label>

        <div className="flex">
          <input
            id={name}
            name={name}
            placeholder={placeholder}
            {...rest}
            ref={ref}
            onChange={onChange}
            className={`
               ${errorMessage ? "input-error" : "input-underline"}
             `}
          />
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
}
