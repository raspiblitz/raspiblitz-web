import type { FC } from "react";

type Props = {
  children?: React.ReactNode;
};

const ModalBackground: FC<Props> = ({ children }) => (
  <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-600 bg-opacity-70">
    {children}
  </div>
);

export default ModalBackground;
