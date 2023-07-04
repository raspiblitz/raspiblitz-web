import type { FC } from "react";

export type Props = {
  toggleText: string;
  active: boolean;
  toggleFn: () => void;
};

const Toggle: FC<Props> = ({ toggleText, active, toggleFn }) => {
  const color = active ? "bg-green-400" : "bg-gray-200";
  const slideRight = active && "translate-x-6";

  return (
    <div className="flex w-full items-center justify-center" onClick={toggleFn}>
      <div className="w-2/3 cursor-default pl-8 text-left">
        {toggleText}&nbsp;
      </div>
      <div className="w-1/3">
        <div
          className={`flex h-3 w-10 items-center rounded-full duration-300 ease-in-out ${color}`}
        >
          <div
            className={`h-5 w-5 transform rounded-full border border-gray-400 bg-white shadow-lg duration-300 ease-in-out ${slideRight}`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Toggle;
