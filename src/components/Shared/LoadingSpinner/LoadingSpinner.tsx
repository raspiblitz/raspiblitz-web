import type { FC } from "react";
import "./LoadingSpinner.css";

type Props = {
  color?: string;
};

const LoadingSpinner: FC<Props> = ({ color }) => {
  return (
    <div
      id="loading-spinner"
      className={`${color || "text-yellow-500"} lds-ring`}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
