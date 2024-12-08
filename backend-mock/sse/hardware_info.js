const util = require("./util");

const hardwareInfo = () => {
  console.info("sending hardware_info");

  util.sendSSE("hardware_info", {
    cpu_overall_percent: 1.57,
    cpu_per_cpu_percent: [1.64, 1.54, 1.54],
    // 4gb RAM
    vram_total_bytes: 3844000000,
    vram_available_bytes: 2611000000,
    vram_used_bytes: 1233000000,
    vram_usage_percent: 32.08,
    temperatures_celsius: { system_temp: 55.0, coretemp: [] },
    boot_time_timestamp: 1674203814.6925313,
    networks: {
      internet_online: "1",
      tor_web_addr: "xxx.onion",
      internet_localip: "127.0.0.1",
      internet_localiprange: "127.0.0.1/24",
    },
    disks: [
      {
        device: "/",
        mountpoint: "/",
        filesystem_type: "ext4",
        partition_total_bytes: 1000203820544,
        partition_used_bytes: 663869611520,
        partition_free_bytes: 336334209024,
        partition_percent: 33.63,
      },
    ],
  });
};

module.exports = { hardwareInfo };
