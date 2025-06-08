import { SSEContext } from "@/context/sse-context";
import ModalDialog from "@/layouts/ModalDialog";
import { AppId } from "@/models/app-status";
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

  return (
    <ModalDialog close={onClose}>
      <div className="flex flex-col text-white max-h-[80vh] text-left">
        <div className="p-4 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-xl font-bold">
            {displayAppId} {t("apps.installation_log")}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2 font-mono text-sm">
            {messagesWithDetails.length > 0 ? (
              messagesWithDetails.map((msg, idx) => (
                <div
                  key={`${msg.id}-${msg.timestamp}-${idx}`}
                  className={`p-2 rounded ${
                    msg.state === "failure"
                      ? "bg-red-950 text-red-200"
                      : msg.state === "success"
                        ? "bg-green-950 text-green-200"
                        : "bg-gray-900 text-gray-200"
                  } ${idx >= prevMessagesCount ? "animate-fadeIn" : ""}`}
                >
                  {msg.message}
                </div>
              ))
            ) : (
              <div className="text-gray-500 italic">
                {t("apps.no_messages")}
              </div>
            )}
            {errorId && (
              <div className="p-3 bg-red-950 text-red-200 rounded mt-4">
                <div className="font-bold">
                  {t("apps.error")}: {errorId}
                </div>
                {errorDetails && (
                  <pre className="whitespace-pre-wrap text-xs mt-2 overflow-x-auto">
                    {errorDetails}
                  </pre>
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
