import { FC } from "react";

const ActionBox: FC<ActionBoxProps> = (props) => {
  return (
    <div className="box-border w-full px-5 pt-5 transition-colors dark:text-white lg:w-1/3">
      <div className="relative rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <div className="flex justify-between">
          <div className="flex w-1/2 items-center font-bold xl:w-2/3">
            {props.name}
          </div>
          <button
            className="bd-button w-1/2 py-1 xl:w-1/3"
            onClick={props.action}
          >
            {props.actionName}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionBox;

export interface ActionBoxProps {
  name: string;
  actionName: string;
  action: () => void;
}
