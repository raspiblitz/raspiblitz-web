import { FC } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export const LoadingBox: FC = () => (
  <div className="h-full p-5">
    <div className="bd-card flex justify-center items-center">
      <LoadingSpinner />
    </div>
  </div>
);

export default LoadingBox;
