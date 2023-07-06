import { FC, useContext } from "react";
import { useTranslation } from "react-i18next";
import LoadingBox from "../../components/LoadingBox";
import { SSEContext } from "../../context/sse-context";

const PI_NUM_CORES = 4;

const bytesToGB = (bytes: number | undefined): string => {
  return bytes ? (bytes / 1024 / 1024 / 1024).toFixed(2) : "-";
};

export const HardwareCard: FC = () => {
  const { t } = useTranslation();
  const { hardwareInfo } = useContext(SSEContext);

  if (!hardwareInfo) {
    return (
      <div className="h-full w-1/2">
        <LoadingBox />
      </div>
    );
  }

  const {
    cpu_overall_percent: cpuOverallPercent,
    temperatures_celsius: temperaturesCelsius,
    vram_usage_percent: vramUsagePercent,
    disks,
  } = hardwareInfo;

  const systemTemp = temperaturesCelsius?.system_temp?.toFixed(2) || "-";

  const cpuPercent = cpuOverallPercent
    ? ((cpuOverallPercent / PI_NUM_CORES) * 100).toFixed(2)
    : "-";

  const mainDisk = disks?.find((disk) => disk.device === "/") || null;

  const hddUsedGB = bytesToGB(mainDisk?.partition_used_bytes);
  const hddTotalGB = bytesToGB(mainDisk?.partition_total_bytes);
  const hddPercentUsed = mainDisk?.partition_percent
    ? 100.0 - mainDisk.partition_percent
    : "-";

  return (
    <div className="bd-card mt-8 w-full transition-colors lg:ml-2 lg:mt-0 lg:w-1/2">
      <h5 className="flex items-center text-lg font-bold">
        {t("hardware.header")}
      </h5>
      <article className="flex flex-row overflow-hidden py-4">
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.cpu_load")}
          </h6>
          <p className="flex">{cpuPercent} %</p>
        </div>
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.temp")}
          </h6>
          <p className="flex">{systemTemp} °C</p>
        </div>
      </article>
      <article className="flex flex-row overflow-hidden py-4">
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.ram_usage")}
          </h6>
          <p className="flex">{vramUsagePercent} %</p>
        </div>
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.disk_usage")}
          </h6>
          <p className="flex">
            {hddUsedGB} / {hddTotalGB} GB ({hddPercentUsed} %)
          </p>
        </div>
      </article>
    </div>
  );
};

export default HardwareCard;
