import type { App } from "@/models/app.model";
import type { HardwareInfo, NetworkInfo, DiskInfo } from "@/models/hardware-info";
import type { SystemStartupInfo } from "@/models/system-startup-info";
import type { Transaction } from "@/models/transaction.model";
import { isAppId } from "@/utils/availableApps";
import { isRecord } from "@/utils/guards";

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isNumber(value);
}

export function isTransaction(value: unknown): value is Transaction {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    isNumber(value.index) &&
    (value.category === "ln" || value.category === "onchain") &&
    (value.type === "send" || value.type === "receive" || value.type === "unknown") &&
    isNumber(value.amount) &&
    isNumber(value.time_stamp) &&
    typeof value.comment === "string" &&
    (value.status === "succeeded" ||
      value.status === "failed" ||
      value.status === "in_flight" ||
      value.status === "unknown") &&
    isNullableNumber(value.block_height) &&
    isNullableNumber(value.num_confs) &&
    isNullableNumber(value.total_fees)
  );
}

export function isApp(value: unknown): value is App {
  return (
    isRecord(value) &&
    isAppId(value.id) &&
    typeof value.name === "string" &&
    typeof value.author === "string" &&
    typeof value.repository === "string" &&
    value.customComponent === undefined
  );
}

export function isSystemStartupInfo(value: unknown): value is SystemStartupInfo {
  return (
    isRecord(value) &&
    (value.bitcoin === "offline" || value.bitcoin === "done") &&
    typeof value.bitcoin_msg === "string" &&
    (value.lightning === "offline" ||
      value.lightning === "bootstrapping" ||
      value.lightning === "bootstrapping_after_unlock" ||
      value.lightning === "locked" ||
      value.lightning === "disabled" ||
      value.lightning === "done") &&
    typeof value.lightning_msg === "string"
  );
}

function isNetworkInfo(value: unknown): value is NetworkInfo {
  return (
    isRecord(value) &&
    typeof value.internet_online === "string" &&
    typeof value.tor_web_addr === "string" &&
    typeof value.internet_localip === "string" &&
    typeof value.internet_localiprange === "string"
  );
}

function isDiskInfo(value: unknown): value is DiskInfo {
  return (
    isRecord(value) &&
    typeof value.device === "string" &&
    typeof value.mountpoint === "string" &&
    typeof value.filesystem_type === "string" &&
    isNumber(value.partition_total_bytes) &&
    isNumber(value.partition_used_bytes) &&
    isNumber(value.partition_free_bytes) &&
    isNumber(value.partition_percent)
  );
}

export function isHardwareInfo(value: unknown): value is HardwareInfo {
  return (
    isRecord(value) &&
    isNumber(value.cpu_overall_percent) &&
    Array.isArray(value.cpu_per_cpu_percent) &&
    value.cpu_per_cpu_percent.every(isNumber) &&
    isNumber(value.vram_total_bytes) &&
    isNumber(value.vram_available_bytes) &&
    isNumber(value.vram_used_bytes) &&
    isNumber(value.vram_usage_percent) &&
    isRecord(value.temperatures_celsius) &&
    isNumber(value.temperatures_celsius.system_temp) &&
    Array.isArray(value.temperatures_celsius.coretemp) &&
    isNumber(value.boot_time_timestamp) &&
    Array.isArray(value.disks) &&
    value.disks.every(isDiskInfo) &&
    (isNetworkInfo(value.networks) ||
      (Array.isArray(value.networks) && value.networks.every(isNetworkInfo)))
  );
}
