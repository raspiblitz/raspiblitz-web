import { FC, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "@/context/app-context";

type Props = {
  children: JSX.Element;
};

//see https://reactrouter.com/docs/en/v6/examples/auth
const RequireAuth: FC<Props> = ({ children }) => {
  let { isLoggedIn } = useContext(AppContext);
  let location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
