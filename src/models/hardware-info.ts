export interface HardwareInfo {
  cpu_overall_percent: number;
  cpu_per_cpu_percent: number[];
  vram_total_bytes: number;
  vram_available_bytes: number;
  vram_used_bytes: number;
  vram_usage_percent: number;
  swap_ram_total_bytes: number;
  swap_used_bytes: number;
  swap_usage_bytes: number;
  temperatures_celsius: TemperatureInfo;
  boot_time_timestamp: number;
  disk_io_read_count: number;
  disk_io_write_count: number;
  disk_io_read_bytes: number;
  disk_io_write_bytes: number;
  disks: DiskInfo[];
  networks: NetworkInfo[];
  networks_bytes_sent: number;
  networks_bytes_received: number;
}

export interface TemperatureInfo {
  [name: string]: unknown;
}

export interface DiskInfo {
  device: string;
  mountpoint: string;
  filesystem_type: string;
  partition_total_bytes: number;
  partition_used_bytes: number;
  partition_free_bytes: number;
  partition_percent: number;
}

export interface NetworkInfo {
  interface_name: string;
  address?: string;
  mac_address: string;
}
