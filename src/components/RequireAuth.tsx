import { AppContext } from "@/context/app-context";
import { FC, PropsWithChildren, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

//see https://reactrouter.com/docs/en/v6/examples/auth
const RequireAuth: FC<PropsWithChildren> = ({ children }) => {
  let { isLoggedIn } = useContext(AppContext);
  let location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
