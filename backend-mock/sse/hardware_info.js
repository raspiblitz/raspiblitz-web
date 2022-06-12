const util = require("./util");

const hardwareInfo = () => {
  console.info("sending hardware_info");

  util.sendSSE("hardware_info", {
    cpu_overall_percent: 1.87,
    cpu_per_cpu_percent: [1.77, 1.91, 1.92],
    vram_total_bytes: 3844000000,
    vram_available_bytes: 2587000000,
    vram_used_bytes: 1257000000,
    vram_usage_percent: 32.7,
    temperatures_celsius: { system_temp: 56.0, coretemp: [] },
    boot_time_timestamp: 1650185397.5461075,
    disks: [
      {
        device: "/",
        mountpoint: "/",
        filesystem_type: "ext4",
        partition_total_bytes: 1000203820544,
        partition_used_bytes: 572113763840,
        partition_free_bytes: 428090056704,
        partition_percent: 42.8,
      },
    ],
    networks: {
      internet_online: "xxx",
      tor_web_addr: "xxx",
      internet_localip: "xxx",
      internet_localiprange: "xxx",
    },
  });
};

module.exports = { hardwareInfo };
