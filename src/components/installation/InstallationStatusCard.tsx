import { Button } from "@heroui/react";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { SSEContext } from "@/context/sse-context";
import { AppId } from "@/models/app-status";
import InstallationLogModal from "./InstallationLogModal";

interface InstallationStatusCardProps {
  appId: string;
}

const InstallationStatusCard = ({ appId }: InstallationStatusCardProps) => {
  const { installationStatus } = useContext(SSEContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const { t } = useTranslation();

  const appStatus = installationStatus[appId];

  if (!appStatus) return null;

  const { messages, currentState, inProgress, errorId } = appStatus;

  // Get the latest 3 messages with non-empty details
  const latestMessages = messages
    .filter((msg) => msg.message && msg.message.trim() !== "")
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 3);

  // Determine status color
  let statusColor = "bg-blue-100 text-blue-800"; // In progress

  if (currentState === "failure" || errorId) {
    statusColor = "bg-red-100 text-red-800"; // Error
  } else if (currentState === "finished" && !errorId) {
    statusColor = "bg-green-100 text-green-800"; // Success
  }

  // Determine action text based on mode
  const firstMessage = messages.length > 0 ? messages[0] : null;
  const actionText =
    firstMessage?.mode === "on" ? t("apps.installing") : t("apps.uninstalling");

  // Format app ID for display
  const displayAppId = getDisplayAppId(appId);

  return (
    <div
      className={`p-4 rounded-lg ${inProgress ? "border-2 border-blue-400" : "border"} mb-4 bg-gray-800`}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-white">{displayAppId}</h3>
        <span className={`px-2 py-1 rounded-full text-xs ${statusColor}`}>
          {inProgress
            ? `${actionText}...`
            : currentState === "failure"
              ? t("apps.failed")
              : t("apps.completed")}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        {latestMessages.length > 0 ? (
          latestMessages.map((msg, idx) => (
            <div
              key={`${msg.id}-${msg.timestamp}-${idx}`}
              className="text-sm border-l-2 border-gray-600 pl-3 py-1 text-gray-300"
            >
              {msg.message}
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-500 italic">
            {t("apps.no_messages")}
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <Button
          className="text-sm text-blue-500 hover:text-blue-400"
          onPress={() => setModalOpen(true)}
        >
          {t("apps.view_full_log")}
        </Button>
      )}

      {isModalOpen && (
        <InstallationLogModal
          appId={appId}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
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

export default InstallationStatusCard;
