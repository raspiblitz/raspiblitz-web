import { type FC, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { getHrefFromApp } from "@/utils";
import { availableApps, isAppId } from "@/utils/availableApps";

export const AppInfo: FC = () => {
  const navigate = useNavigate();
  const { appId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { appStatus } = useContext(SSEContext);
  const knownAppId = isAppId(appId) ? appId : null;
  const customComponent = knownAppId
    ? availableApps[knownAppId].customComponent
    : undefined;

  const app = appStatus.data.find((item) => item.id === knownAppId);

  useEffect(() => {
    setIsLoading(true);

    if (app) {
      setIsLoading(false);

      if (!customComponent) {
        const href = getHrefFromApp(app);
        if (app.installed && href) {
          const win = window.open(href, "_blank", "noopener,noreferrer");
          if (win != null) {
            win.focus();
          }
        }
        navigate("/apps");
      }
    }
  }, [app, customComponent, navigate]);

  if (!knownAppId) {
    return <Navigate to="/apps" replace />;
  }

  if (isLoading || !app) {
    return <PageLoadingScreen />;
  }

  // needs to be PascalCase to be used as a component in JSX
  const CustomComponent = customComponent;

  return <>{CustomComponent && <CustomComponent />}</>;
};

export default AppInfo;
