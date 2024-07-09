import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import { AdvancedAppStatusElectron } from "@/models/advanced-app-status";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { AxiosResponse } from "axios";
import { QRCodeSVG } from "qrcode.react";
import { FC, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Electrs: FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appStatus } = useContext(SSEContext);
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState<AdvancedAppStatusElectron | null>(
    null,
  );
  const [QRAddress, setQRAddress] = useState<string | null>(null);
  const [showTorConn, setShowTorConn] = useState<boolean>(false);
  const [showLocalConn, setShowLocalConn] = useState<boolean>(false);

  useEffect(() => {
    if (!appData) {
      instance
        .get("apps/status_advanced/electrs")
        .then((resp: AxiosResponse<AdvancedAppStatusElectron>) => {
          setAppData(resp.data);
          if (resp.data?.TORaddress && resp.data?.portSSL) {
            setQRAddress(`${resp.data.TORaddress}:${resp.data.portSSL}:s`);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          checkError(error);
        });
    }
  }, [appData]);

  if (isLoading || !appData || !appStatus) {
    return <PageLoadingScreen />;
  }

  const { TORaddress, portSSL, localIP, version, initialSyncDone } = appData;

  if (appStatus.find((app) => app.id === "electrs")?.installed === false) {
    navigate("/apps");
    return <></>;
  }

  const changeQR = (type: "local" | "tor") => {
    switch (type) {
      case "local":
        setQRAddress(`${localIP}:${portSSL}:s`);
        break;
      case "tor":
        setQRAddress(`${TORaddress}:${portSSL}:s`);
        break;
    }
  };

  if (!showTorConn && TORaddress && portSSL) {
    setShowTorConn(true);
  }

  if (!showLocalConn && localIP && portSSL) {
    setShowLocalConn(true);
  }

  return (
    <main className="page-container content-container w-full bg-gray-700 text-white lg:pr-8">
      {/* Back Button */}
      <section className="w-full px-5 py-9 text-gray-200">
        <button
          onClick={() => navigate("/apps")}
          className="flex items-center text-xl font-bold outline-none"
        >
          <ChevronLeftIcon className="inline-block h-5 w-5" />
          {t("navigation.back")}
        </button>
      </section>
      <section className="bd-card mx-5 flex flex-col gap-4 px-5 lg:flex-row">
        <article className="lg:w-1/2">
          {!initialSyncDone && <p>{t("appInfo.electrs.initialSync")}</p>}
          {initialSyncDone && (
            <>
              <article className="mt-4 flex flex-col gap-4">
                <h2>Electrs Version {version}</h2>
                {showTorConn && (
                  <>
                    <p>{t("appInfo.electrs.connectLocal")}:</p>
                    <p>{`${localIP}:${portSSL}:s`}</p>
                  </>
                )}
                {showTorConn && (
                  <>
                    <p>{t("appInfo.electrs.connectTor")}:</p>
                    <p>{`${TORaddress}:${portSSL}:s`}</p>
                  </>
                )}
              </article>
              <p className="mt-4 text-sm">
                {t("appInfo.electrs.connectionInfo")}
              </p>
              <article className="lg:w-1/2">
                <div className="flex justify-center">
                  <button
                    className="switch-button"
                    onClick={() => changeQR("local")}
                  >
                    Local
                  </button>
                  <button
                    className="switch-button"
                    onClick={() => changeQR("tor")}
                  >
                    {" "}
                    Tor
                  </button>
                </div>
                {QRAddress && (
                  <QRCodeSVG
                    role={"img"}
                    className="mx-auto mt-4 border-2 border-white"
                    value={QRAddress}
                    size={256}
                  />
                )}
                {!QRAddress && (
                  <p className="mt-4 text-center">Address not available</p>
                )}
              </article>
            </>
          )}
        </article>
      </section>
    </main>
  );
};

export default Electrs;
