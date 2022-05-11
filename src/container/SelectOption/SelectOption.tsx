import { FC } from "react";

type Props = {
  id: string;
  radioGroup: string;
  value: string;
  selected?: boolean;
  children?: React.ReactNode;
};

const SelectOption: FC<Props> = ({ children, id, radioGroup, value }) => {
  return (
    <div
      className={`my-4 rounded border border-gray-700 shadow-md dark:bg-gray-700`}
    >
      <input
        id={id}
        type="radio"
        name={radioGroup}
        value={value}
        className="mx-4 align-middle"
      />
      <label htmlFor={id} className="inline-block py-8 px-4">
        <span className="text-center align-middle">{children}</span>
      </label>
    </div>
  );
};

export default SelectOption;
