import { FC } from "react";

const ModalBackground: FC = (props) => (
  <div className="flex items-center justify-center fixed left-0 top-0 w-full h-full z-50 bg-opacity-20 bg-gray-600 dark:bg-gray-300 dark:bg-opacity-20">
    {props.children}
  </div>
);

export default ModalBackground;
