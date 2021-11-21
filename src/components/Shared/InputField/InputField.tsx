import { forwardRef } from "react";
import type { ChangeEvent, Ref } from "react";
import type { FieldError } from "react-hook-form";

const InputField = forwardRef(
  (props: InputFieldProps, ref: Ref<HTMLInputElement>) => {
    const {
      label,
      name,
      errorMessage,
      placeholder,
    } = props;

    return (
      <>
                <label htmlFor={name}>{label}</label>
        <input id={name} name={name} placeholder={placeholder} />
        {errorMessage?.type === 'required' && errorMessage?.message}

      </>
    );
  }
);

// const InputField = forwardRef(
//   (props: InputFieldProps, ref: Ref<HTMLInputElement>) => {
//     const {
//       errorMessage,
//       id,
//       inputRightAddon,
//       isFormValid,
//       label,
//       onChange,
//       pattern,
//       placeholder,
//       required,
//       textAlign,
//       type,
//       value,
//     } = props;

//     return (
//       <>
//         <label className="label-underline" htmlFor={id}>
//           {label}
//         </label>

//         <div className="flex">
//           <input
//             className={`
//               ${isFormValid ? "input-underline" : "input-error"}
//               ${textAlign === "right" ?? "text-right"}
//               ${inputRightAddon ?? "w-7/12"}
//             `}
//             id={id}
//             onChange={onChange}
//             pattern={pattern}
//             placeholder={placeholder}
//             ref={ref}
//             required={required}
//             type={type}
//             value={value}
//           />

//           {inputRightAddon && (
//             <div className="w-5/12 text-sm break-words">{inputRightAddon}</div>
//           )}
//         </div>

//         {errorMessage && <p className="text-red-500">{errorMessage}</p>}
//       </>
//     );
//   }
// );

export default InputField;

// export interface InputFieldProps {
//   errorMessage?: string;
//   id: string;
//   inputRightAddon?: string;
//   isFormValid?: boolean;
//   label: string;
//   onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
//   pattern?: string;
//   placeholder?: string;
//   required?: boolean;
//   textAlign?: "right";
//   type: "text" | "number";
//   value?: string | number;
// }
export interface InputFieldProps {
  label: string;
  name: string;
  errorMessage?: FieldError;
  placeholder?: string;
}
