import { FC } from "react";

type Props = {
  id: string;
  radioGroup: string;
  value: string;
};

const SelectOption: FC<Props> = ({ children, id, radioGroup, value }) => {
  return (
    <>
      <label
        htmlFor={id}
        className="my-4 flex items-center justify-center rounded px-4 shadow-md bg-gray-50 dark:bg-gray-700"
      >
        <input
          id={id}
          type="radio"
          name={radioGroup}
          value={value}
          className="w-2/12"
        />
        <span className="w-10/12 rounded p-5 px-4 text-center">{children}</span>
      </label>
    </>
  );
};

export default SelectOption;
