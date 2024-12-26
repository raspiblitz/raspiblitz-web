import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router";

type Props = {
  needsSetup: boolean;
};

// see https://reactrouter.com/docs/en/v6/examples/auth
const RequireSetup: FC<PropsWithChildren<Props>> = ({
  needsSetup,
  children,
}) => {
  if (!needsSetup) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RequireSetup;
