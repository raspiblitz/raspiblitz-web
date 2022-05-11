import { ChangeEvent, FC } from "react";
import { SetupPhase } from "../../models/setup.model";

type Props = {
  id: string;
  radioGroup: string;
  value: string;
  selected: SetupPhase | null;
  children?: React.ReactNode;
  onSelectOption: (event: ChangeEvent<HTMLInputElement>) => void;
};

const SelectOption: FC<Props> = ({
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
      className={`my-4 rounded border border-gray-700 px-2 shadow-md ${
        currentSelected ? "bg-yellow-500" : "dark:bg-gray-700"
      }`}
    >
      {/* Empty bc react complaints */}
      <input
        id={id}
        type="radio"
        name={radioGroup}
        value={value}
        checked={currentSelected}
        onChange={onSelectOption}
        className="appearance-none align-middle"
      />
      <label htmlFor={id} className="inline-block py-8">
        <span className="text-center align-middle">{children}</span>
      </label>
    </div>
  );
};

export default SelectOption;
