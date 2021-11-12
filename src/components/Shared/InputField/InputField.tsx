import { forwardRef } from "react";
import type { ChangeEvent, Ref } from "react";

const InputField = forwardRef(
  (props: InputFieldProps, ref: Ref<HTMLInputElement>) => {
    const {
      errorMessage,
      id,
      isFormValid,
      label,
      onChange,
      pattern,
      placeholder,
      required,
      type,
    } = props;

    return (
      <>
        <label className="label-underline" htmlFor={id}>
          {label}
        </label>

        <input
          className={isFormValid ? "input-underline" : "input-error"}
          id={id}
          onChange={onChange}
          pattern={pattern}
          placeholder={placeholder}
          ref={ref}
          required={required}
          type={type}
        />

        <p className="text-red-500">{errorMessage}</p>
      </>
    );
  }
);

export default InputField;

export interface InputFieldProps {
  errorMessage?: string;
  id: string;
  isFormValid?: boolean;
  label: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  type: "text" | "number";
}
