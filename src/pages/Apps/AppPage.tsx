import { WebSocketContext } from "@/context/ws-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { getHrefFromApp } from "@/utils";
import { availableApps } from "@/utils/availableApps";
import { FC, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const AppInfo: FC = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { appStatus } = useContext(WebSocketContext);
  const { customComponent } = availableApps[appId!];

  const app = appStatus.find((app) => app.id === appId);

  useEffect(() => {
    setIsLoading(true);

    if (app) {
      setIsLoading(false);

      if (!customComponent) {
        if (app.installed) {
          const win = window.open(getHrefFromApp(app), "_blank");
          if (win != null) {
            win.focus();
          }
        }
        navigate("/apps");
      }
    }
  }, [app, customComponent, navigate]);

  if (isLoading || !app) {
    return <PageLoadingScreen />;
  }

  if (!appId) {
    navigate("/apps");
    return;
  }

  // needs to be PascalCase to be used as a component in JSX
  const CustomComponent = customComponent;

  return <>{CustomComponent && <CustomComponent />}</>;
};

export default AppInfo;
