import type { FC } from "react";

export type Props = {
  name: string;
  actionName: string;
  action: () => void;
};

const ActionBox: FC<Props> = ({ name, action, actionName }) => {
  return (
    <div className="box-border w-full transition-colors dark:text-white">
      <article className="relative rounded bg-white p-5 shadow-xl dark:bg-gray-800">
        <div className="flex justify-between">
          <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">{name}</h4>
          <button className="bd-button w-1/2 py-1 xl:w-1/3" onClick={action}>
            {actionName}
          </button>
        </div>
      </article>
    </div>
  );
};

export default ActionBox;
