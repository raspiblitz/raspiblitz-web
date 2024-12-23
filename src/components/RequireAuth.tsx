import { AppContext } from "@/context/app-context";
import { type FC, type PropsWithChildren, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

// see https://reactrouter.com/docs/en/v6/examples/auth
const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  const { isLoggedIn } = useContext(AppContext);
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
