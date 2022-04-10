import type { FC } from "react";

type Props = {
  children?: React.ReactNode;
};

const ModalBackground: FC<Props> = (props) => (
  <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-600 bg-opacity-20 dark:bg-gray-300 dark:bg-opacity-20">
    {props.children}
  </div>
);

export default ModalBackground;
