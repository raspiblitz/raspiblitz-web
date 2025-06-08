import { SSEContext } from "@/context/sse-context";
import ModalDialog from "@/layouts/ModalDialog";
import { AppId } from "@/models/app-status";
import { Button } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface InstallationLogModalProps {
  appId: string;
  onClose: () => void;
}

const InstallationLogModal = ({
  appId,
  onClose,
}: InstallationLogModalProps) => {
  const { installationStatus } = useContext(SSEContext);
  const logEndRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [prevMessagesCount, setPrevMessagesCount] = useState(0);

  const appStatus = installationStatus[appId];

  if (!appStatus) return null;

  const { messages, errorId } = appStatus;

  // Filter messages with non-empty details
  const messagesWithDetails = messages
    .filter((msg) => msg.message && msg.message.trim() !== "")
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setPrevMessagesCount(messagesWithDetails.length);
  }, [messagesWithDetails.length]);

  // Format error details if present
  const errorMsg = messages.find(
    (msg) => msg.error_id && msg.error_id !== "none",
  );
  const errorDetails = errorMsg?.message || "";

  // Format app ID for display
  const displayAppId = getDisplayAppId(appId);

  // Download log function
  const downloadLog = () => {
    const logContent = messagesWithDetails
      .map((msg) => {
        const timestamp = msg.timestamp
          ? new Date(msg.timestamp * 1000).toISOString()
          : new Date().toISOString();
        const state = msg.state ? `[${msg.state.toUpperCase()}]` : "[INFO]";
        return `${timestamp} ${state} ${msg.message}`;
      })
      .join("\n");

    const errorContent = errorId
      ? `\n\nERROR: ${errorId}\n${errorDetails}`
      : "";
    const fullContent = `Installation Log for ${displayAppId}\n${"=".repeat(50)}\n\n${logContent}${errorContent}`;

    const blob = new Blob([fullContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appId}-installation-log-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <ModalDialog close={onClose}>
      <div className="flex flex-col text-white max-h-[80vh] text-left bg-gradient-to-b from-gray-900 to-gray-950 rounded-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-gray-600/50 sticky top-0 bg-gradient-to-r from-gray-800 to-gray-900 z-10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse " />
              <h2 className="text-xl font-semibold text-white">
                {displayAppId} {t("apps.installation_log")}
              </h2>
            </div>
            <Button
              size="sm"
              variant="flat"
              onPress={downloadLog}
              className="bg-gray-700/50 hover:bg-gray-600/70 text-gray-200 border border-gray-600/30 transition-all duration-200 hover:scale-105"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>download icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {t("common.download_log") || "Download"}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-950/50">
          <div className="space-y-3 font-mono text-sm">
            {messagesWithDetails.length > 0 ? (
              messagesWithDetails.map((msg, idx) => (
                <div
                  key={`${msg.id}-${msg.timestamp}-${idx}`}
                  className={`p-3 rounded-lg border-l-4 transition-all duration-300 ${
                    msg.state === "failure"
                      ? "bg-gradient-to-r from-red-950/80 to-red-900/40 border-l-red-500 text-red-100 shadow-lg shadow-red-900/20"
                      : msg.state === "success"
                        ? "bg-gradient-to-r from-green-950/80 to-green-900/40 border-l-green-500 text-green-100 shadow-lg shadow-green-900/20"
                        : "bg-gradient-to-r from-gray-800/80 to-gray-700/40 border-l-blue-500 text-gray-100 shadow-lg shadow-gray-900/20"
                  } ${idx >= prevMessagesCount ? "animate-fadeIn" : ""} hover:scale-[1.01] hover:shadow-xl`}
                >
                  <div className="flex items-start gap-2">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        msg.state === "failure"
                          ? "bg-red-500"
                          : msg.state === "success"
                            ? "bg-green-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="break-words flex-1 leading-relaxed">
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
                </div>
                <div className="text-gray-400 italic text-lg">
                  {t("apps.no_messages")}
                </div>
              </div>
            )}
            {errorId && (
              <div className="p-4 bg-gradient-to-r from-red-900/80 to-red-800/60 border border-red-600/50 rounded-lg mt-6 shadow-xl shadow-red-900/30">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="font-bold text-red-100 text-base">
                    {t("apps.error")}: {errorId}
                  </div>
                </div>
                {errorDetails && (
                  <div className="bg-black/30 rounded-md p-3 border border-red-700/30">
                    <pre className="whitespace-pre-wrap text-xs text-red-200 overflow-x-auto leading-relaxed">
                      {errorDetails}
                    </pre>
                  </div>
                )}
              </div>
            )}
            <div ref={logEndRef} />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
};

// Helper function to convert app ID strings to display names
function getDisplayAppId(id: string): string {
  // Try to match with the AppId enum
  for (const [key, value] of Object.entries(AppId)) {
    if (value === id) {
      // Format the enum key to be more readable
      // e.g., BTC_RPC_EXPLORER -> BTC RPC Explorer
      return key
        .split("_")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ");
    }
  }

  // If no match in enum, format the id string directly
  return id
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default InstallationLogModal;
