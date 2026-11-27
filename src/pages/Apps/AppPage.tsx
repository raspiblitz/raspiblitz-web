import { type FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";
import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { getHrefFromApp } from "@/utils";
import { availableApps, isAppId } from "@/utils/availableApps";

export const AppInfo: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const { appStatus } = useContext(SSEContext);
  const knownAppId = isAppId(appId) ? appId : null;
  const customComponent = knownAppId
    ? availableApps[knownAppId].customComponent
    : undefined;

  const app = appStatus.data.find((item) => item.id === knownAppId);
  const href = app?.installed ? getHrefFromApp(app) : undefined;
  const confirmHttp =
    window.location.protocol === "https:" && href?.startsWith("http:");

  useEffect(() => {
    setIsLoading(true);

    if (app) {
      setIsLoading(false);

      if (!customComponent && !confirmHttp) {
        if (href) {
          window.open(href, "_blank", "noopener,noreferrer");
        }
        navigate("/apps");
      }
    }
  }, [app, customComponent, confirmHttp, href, navigate]);

  if (!knownAppId) {
    return <Navigate to="/apps" replace />;
  }

  if (isLoading || !app) {
    return <PageLoadingScreen />;
  }

  if (!customComponent && confirmHttp) {
    return (
      <main className="page-container content-container w-full bg-gray-700 text-white">
        <section className="w-full px-5 py-9">
          <a
            className="underline"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("apps.open")} {availableApps[knownAppId].name} (HTTP)
          </a>
        </section>
      </main>
    );
  }

  // needs to be PascalCase to be used as a component in JSX
  const CustomComponent = customComponent;

  return <>{CustomComponent && <CustomComponent />}</>;
};

export default AppInfo;
