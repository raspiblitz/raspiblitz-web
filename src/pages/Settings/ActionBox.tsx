import { Button } from "@/components/Button";
import type { FC, PropsWithChildren, ReactElement } from "react";

export type Props = {
  name: string | ReactElement;
  actionName: string;
  action: () => void;
  showChild: boolean;
};

/**
 * displays a box with a title and a button which triggers an action (e.g. reboot)
 * has a child component which is displayed if showChild is true
 */
const ActionBox: FC<PropsWithChildren<Props>> = ({
  name,
  action,
  actionName,
  showChild,
  children,
}) => {
  return (
    <>
      {showChild && children}
      <div className="box-border w-full text-white transition-colors">
        <article className="relative rounded bg-gray-800 p-5 shadow-xl">
          <div className="flex justify-between">
            <h4 className="flex w-1/2 items-center font-bold xl:w-2/3">
              {name}
            </h4>
            <Button onPress={action} color="primary">
              {actionName}
            </Button>
          </div>
        </article>
      </div>
    </>
  );
};

export default ActionBox;
