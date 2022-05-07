import { FC } from "react";
import { useTranslation } from "react-i18next";
import { HardwareInfo } from "../../../models/hardware-info";
import LoadingBox from "../../Shared/LoadingBox/LoadingBox";

const PI_NUM_CORES = 4;

export type Props = {
  hardwareInfo: HardwareInfo | null;
};

export const HardwareCard: FC<Props> = ({ hardwareInfo }) => {
  const { t } = useTranslation();

  if (!hardwareInfo) {
    return (
      <div className="mt-10 w-full transition-colors lg:mt-0 lg:ml-2 lg:w-1/2">
        <LoadingBox />
      </div>
    );
  }

  const {
    cpu_overall_percent,
    temperatures_celsius,
    disks,
    vram_usage_percent,
  } = hardwareInfo;

  const system_temp = temperatures_celsius.system_temp;

  const cpuPercent = (cpu_overall_percent / PI_NUM_CORES) * 100;

  const mainHDD = disks.find((disk) => disk.device === "/");

  // byte => gigabyte converstion
  const hddUsedGB = mainHDD?.partition_used_bytes
    ? (mainHDD.partition_used_bytes / 1024 / 1024 / 1024).toFixed(2)
    : "-";

  const hddFreeGB = mainHDD?.partition_total_bytes
    ? (mainHDD.partition_total_bytes / 1024 / 1024 / 1024).toFixed(2)
    : "-";

  let hddUsedPercent: string = "-";

  if (!isNaN(+hddUsedGB) && !isNaN(+hddFreeGB)) {
    hddUsedPercent = ((+hddUsedGB / +hddFreeGB) * 100).toFixed(2);
  }

  return (
    <div className="bd-card mt-10 w-full transition-colors lg:mt-0 lg:ml-2 lg:w-1/2">
      <div className="flex items-center text-lg font-bold">
        {t("hardware.header")}
      </div>
      <article className="flex flex-row overflow-hidden py-4">
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.cpu_load")}
          </h6>
          <div className="flex">{cpuPercent} %</div>
        </div>
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.temp")}
          </h6>
          <div className="flex">{system_temp} °C</div>
        </div>
      </article>
      <article className="flex flex-row overflow-hidden py-4">
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.ram_usage")}
          </h6>
          <div className="flex">{vram_usage_percent} %</div>
        </div>
        <div className="flex w-1/2 flex-col">
          <h6 className="text-sm text-gray-500 dark:text-gray-200">
            {t("hardware.disk_usage")}
          </h6>
          <div className="flex">
            {hddUsedGB} / {hddFreeGB} GB ({hddUsedPercent} %)
          </div>
        </div>
      </article>
    </div>
  );
};

export default HardwareCard;
