import { FC } from "react";
import { Navigate } from "react-router-dom";

type Props = {
  needsSetup: boolean;
  children: JSX.Element;
};

//see https://reactrouter.com/docs/en/v6/examples/auth
const RequireSetup: FC<Props> = ({ needsSetup, children }) => {
  if (!needsSetup) {
    return <Navigate to={"/home"} replace />;
  }

  return children;
};

export default RequireSetup;
