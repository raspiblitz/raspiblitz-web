export interface HardwareInfo {
  cpu_overall_percent: number;
  cpu_per_cpu_percent: number[];
  vram_total_bytes: number;
  vram_available_bytes: number;
  vram_used_bytes: number;
  vram_usage_percent: number;
  temperatures_celsius: TemperatureInfo;
  boot_time_timestamp: number;
  disks: DiskInfo[];
  networks: NetworkInfo[];
}

export interface TemperatureInfo {
  system_temp: number;
  coretemp: unknown[];
}

export interface DiskInfo {
  device: string;
  mountpoint: string;
  filesystem_type: string;
  partition_total_bytes: number;
  partition_used_bytes: number;
  partition_free_bytes: number;
  partition_percent: number; // free percentage
}

export interface NetworkInfo {
  internet_online: string;
  tor_web_addr: string;
  internet_localip: string;
  internet_localiprange: string;
}
