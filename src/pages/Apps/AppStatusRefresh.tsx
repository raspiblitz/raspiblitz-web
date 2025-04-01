import { SSEContext } from "@/context/sse-context";
import { instance } from "@/utils/interceptor";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@heroui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const AppStatusRefresh = () => {
  const { t } = useTranslation();
  const { appStatus } = useContext(SSEContext);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formattedAge, setFormattedAge] = useState("");

  useEffect(() => {
    if (appStatus?.timestamp !== undefined) {
      const updateTimestamp = appStatus.timestamp;
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
      const ageInSeconds = currentTimestamp - updateTimestamp;

      const formatAgeText = (seconds: number): string => {
        if (seconds < 10) {
          return t("apps.age_just_now");
        }

        // If less than 60 seconds, show "<1 minute ago"
        if (seconds < 60) {
          return t("apps.age_less_than_minute");
        }

        if (seconds < 3600) {
          const minutes = Math.floor(seconds / 60);
          return minutes === 1
            ? t("apps.age_minute", { minutes })
            : t("apps.age_minutes", { minutes });
        }

        const hours = Math.floor(seconds / 3600);
        return hours === 1
          ? t("apps.age_hour", { hours })
          : t("apps.age_hours", { hours });
      };

      setFormattedAge(formatAgeText(ageInSeconds));

      const intervalId = setInterval(() => {
        const newCurrentTimestamp = Math.floor(Date.now() / 1000);
        const newAgeInSeconds = newCurrentTimestamp - updateTimestamp;
        setFormattedAge(formatAgeText(newAgeInSeconds));
      }, 10000); // Update every 10 seconds

      return () => clearInterval(intervalId);
    }
  }, [appStatus.timestamp, t]);

  useEffect(() => {
    const handleAppStateUpdating = () => {
      setIsUpdating(true);
    };

    const handleAppStateUpdateSuccess = () => {
      setIsUpdating(false);
      toast.success(t("apps.refresh_success"));
    };

    window.addEventListener("app_state_updating", handleAppStateUpdating);
    window.addEventListener(
      "app_state_updating_success",
      handleAppStateUpdateSuccess,
    );

    return () => {
      window.removeEventListener("app_state_updating", handleAppStateUpdating);
      window.removeEventListener(
        "app_state_updating_success",
        handleAppStateUpdateSuccess,
      );
    };
  }, [t]);

  const handleRefresh = useCallback(async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    try {
      await instance.post("apps/update-cache");
    } catch (error) {
      setIsUpdating(false);
      toast.error(t("apps.refresh_error"));
      console.error("Error refreshing app status:", error);
    }
  }, [t, isUpdating]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-400">
          {t("apps.data_age")}: {formattedAge}
        </span>
        <Tooltip content={t("apps.refresh_tooltip")}>
          <InformationCircleIcon className="h-4 w-4 text-gray-400" />
        </Tooltip>
      </div>
      <Tooltip
        content={t("apps.refresh_expensive_warning")}
        showArrow
        placement="left"
      >
        <Button
          color="primary"
          size="sm"
          isLoading={isUpdating}
          onPress={handleRefresh}
          startContent={<ArrowPathIcon className="h-5 w-5" />}
        >
          {isUpdating ? t("apps.refreshing") : t("apps.refresh")}
        </Button>
      </Tooltip>
    </div>
  );
};

export default AppStatusRefresh;
