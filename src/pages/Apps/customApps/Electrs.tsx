import {
  ChevronLeftIcon,
  ClipboardDocumentCheckIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/24/outline";
import { Button, Card, Tab, Tabs } from "@heroui/react";
import { QRCodeSVG } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { Headline } from "@/components/Headline";
import { SSEContext } from "@/context/sse-context";
import useClipboard from "@/hooks/use-clipboard";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import type { AdvancedAppStatusElectron } from "@/models/advanced-app-status";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";

function CopySnippet({ text }: { text: string }) {
  const [copy, copied] = useClipboard(text);
  return (
    <div className="flex max-w-[80%] items-center gap-2 rounded-lg bg-primary px-3 py-2 text-white">
      <pre className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm">
        {text}
      </pre>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        className="shrink-0 rounded p-1 hover:bg-white/20 transition-colors"
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="h-5 w-5" />
        ) : (
          <ClipboardDocumentIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

const Electrs = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { appStatus } = useContext(SSEContext);
  const [isLoading, setIsLoading] = useState(true);
  const [appData, setAppData] = useState<AdvancedAppStatusElectron | null>(
    null,
  );
  const [QRAddressLocal, setQRAddressLocal] = useState<string | null>(null);
  const [QRAddressTor, setQRAddressTor] = useState<string | null>(null);

  useEffect(() => {
    if (!appData) {
      instance
        .get("apps/status_advanced/electrs")
        .then((resp) => {
          setAppData(resp.data);
          if (resp.data?.TORaddress && resp.data?.portSSL) {
            setQRAddressTor(`${resp.data.TORaddress}:${resp.data.portSSL}:s`);
          }
          if (resp.data?.localIP && resp.data?.portSSL) {
            setQRAddressLocal(`${resp.data.localIP}:${resp.data.portSSL}:s`);
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

  if (appStatus.data.find((app) => app.id === "electrs")?.installed === false) {
    navigate("/apps");
    return null;
  }

  return (
    <main className="page-container content-container flex w-full flex-col items-center bg-gray-700 text-white">
      {/* Back Button */}
      <section className="w-full px-5 py-9 text-gray-200">
        <Button onPress={() => navigate("/apps")} variant="primary">
          <span className="flex items-center gap-2">
            <ChevronLeftIcon className="inline-block h-5 w-5" />
            {t("navigation.back")}
          </span>
        </Button>
      </section>

      <Card className="bd-card w-full md:w-11/12">
        <Card.Header>
          <Headline as="h3" size="xl">
            Electrs Version <span className="font-bold">{version}</span>
          </Headline>
        </Card.Header>
        <Card.Content className="flex">
          {!initialSyncDone ? (
            <span>{t("appInfo.electrs.initialSync")}</span>
          ) : (
            <>
              <span className="mb-4">
                {t("appInfo.electrs.connectionInfo")}
              </span>
              <Tabs
                aria-label="Connection Options"
                color="primary"
                size="lg"
                className="justify-center"
              >
                <Tab key="local" title="Local Connection">
                  <span>{t("appInfo.electrs.connectLocal")}: </span>
                  {QRAddressLocal ? (
                    <div className="mt-4 flex flex-col items-center justify-center gap-4">
                      <QRCodeSVG
                        value={QRAddressLocal}
                        size={256}
                        className="border-2 border-white"
                      />
                      <CopySnippet text={`${localIP}:${portSSL}:s`} />
                    </div>
                  ) : (
                    <span className="mt-4 text-center">
                      {t("appInfo.electrs.not_available")}
                    </span>
                  )}
                </Tab>
                <Tab key="tor" title="Tor">
                  <span>{t("appInfo.electrs.connectTor")}:</span>
                  {QRAddressTor ? (
                    <div className="mt-4 flex flex-col items-center justify-center gap-4">
                      <QRCodeSVG
                        value={QRAddressTor}
                        size={256}
                        className="border-2 border-white"
                      />
                      <CopySnippet text={`${TORaddress}:${portSSL}:s`} />
                    </div>
                  ) : (
                    <span className="mt-4 text-center">
                      {t("appInfo.electrs.not_available")}
                    </span>
                  )}
                </Tab>
              </Tabs>
            </>
          )}
        </Card.Content>
      </Card>
    </main>
  );
};

export default Electrs;
