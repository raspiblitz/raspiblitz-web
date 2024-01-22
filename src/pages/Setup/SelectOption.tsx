import { FC, PropsWithChildren } from "react";

type Props = {
  id: string;
  radioGroup: string;
  value: string;
  selected: string | null;
  // Can be LightningDialog or SetupPhase
  // TODO: Move both to something better than enums
  onSelectOption: (value: any) => void;
};

const SelectOption: FC<PropsWithChildren<Props>> = ({
  children,
  id,
  radioGroup,
  value,
  selected,
  onSelectOption,
}) => {
  const currentSelected = selected === value;
  return (
    <div
      className={`my-4 rounded border-4 border-gray-200 px-2 ${
        currentSelected ? "border-4 border-yellow-500" : "dark:bg-gray-700"
      }`}
      onClick={() => onSelectOption(value)}
    >
      <input
        id={id}
        type="radio"
        name={radioGroup}
        value={value}
        checked={currentSelected}
        readOnly
        className="appearance-none align-middle"
      />
      <label htmlFor={id} className="inline-block py-8">
        <span className="text-center align-middle">{children}</span>
      </label>
    </div>
  );
};

export default SelectOption;
