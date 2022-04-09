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
        className="flex items-center justify-center px-4 shadow-md rounded dark:bg-gray-700"
      >
        <input id={id} type="radio" name={radioGroup} value={value} />
        <span className="rounded p-5 px-4 text-center">{children}</span>
      </label>
    </>
  );
};

export default SelectOption;
