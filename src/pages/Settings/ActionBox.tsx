import type { FC, ReactElement, ReactNode } from "react";

export type Props = {
  name: string | ReactElement;
  actionName: string;
  action: () => void;
  showChild: boolean;
  children: ReactNode;
};

/**
 * displays a box with a title and a button which triggers an action (e.g. reboot)
 * has a child component which is displayed if showChild is true
 */
const ActionBox: FC<Props> = ({
  name,
  action,
  actionName,
  showChild,
  children,
}) => {
  return (
    <>
      {showChild && children}
      <div className="box-border w-full transition-colors dark:text-white">
        <article className="relative rounded bg-white p-5 shadow-xl dark:bg-gray-800">
          <div className="flex justify-between">
            <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">
              <span>{name}</span>
            </h4>
            <button className="bd-button w-1/2 py-1 xl:w-1/3" onClick={action}>
              {actionName}
            </button>
          </div>
        </article>
      </div>
    </>
  );
};

export default ActionBox;
