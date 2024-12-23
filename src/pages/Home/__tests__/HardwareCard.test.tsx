import type { HardwareInfo } from "@/models/hardware-info";
import { render, screen } from "test-utils";
import HardwareCard from "../HardwareCard";

const basicHardwareInfo: HardwareInfo = {
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
  networks: [
    {
      internet_online: "1",
      tor_web_addr: "onion.onion",
      internet_localip: "127.0.0.1",
      internet_localiprange: "127.0.0.1/24",
    },
  ],
};

describe("HardwareCard", () => {
  const setup = () => {
    render(<HardwareCard />, {
      providerOptions: {
        sseProps: {
          hardwareInfo: basicHardwareInfo,
        },
      },
    });
  };

  test("renders without props from SSE", () => {
    render(<HardwareCard />);

    const hardwareHeader = screen.getByText(/hardware.header/i);
    expect(hardwareHeader).toBeInTheDocument();
  });

  test("display CPU load correctly", () => {
    setup();

    const cpuPercent = screen.getByText(/46.75 %/i);
    expect(cpuPercent).toBeInTheDocument();
  });

  test("display temperature correctly", () => {
    setup();

    const hardwareHeader = screen.getByText(/56.00 °C/i);
    expect(hardwareHeader).toBeInTheDocument();
  });

  test("display RAM correctly", () => {
    setup();

    const hardwareHeader = screen.getByText(/32.7 %/i);
    expect(hardwareHeader).toBeInTheDocument();
  });

  test("display disk space correctly", () => {
    setup();

    const hardwareHeader = screen.getByText(/57.2 %/i);
    expect(hardwareHeader).toBeInTheDocument();
  });
});
