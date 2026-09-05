import {
  Screen,
  SetupMigrationMode,
  SetupMigrationOS,
  SetupPhase,
  type SetupState,
  SetupStatus,
} from "@/models/setup.model";
import { initSetupStart, setupMonitoringLoop } from "@/pages/Setup/setup-functions";
import { instance } from "@/utils/interceptor";

describe("initSetupStart", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    [SetupMigrationOS.NULL, SetupMigrationMode.NORMAL],
    [null, SetupMigrationMode.NORMAL],
    [SetupMigrationOS.UMBREL, SetupMigrationMode.NULL],
    [SetupMigrationOS.UMBREL, null],
    [null, null],
  ])(
    "shows a recoverable error for migration OS %s and mode %s",
    async (hddGotMigrationData, migrationMode) => {
      vi.spyOn(instance, "get").mockResolvedValue({
        data: {
          hddGotBlockchain: "1",
          hddGotMigrationData,
          migrationMode,
          setupPhase: SetupPhase.MIGRATION,
        },
      });
      const updateState = vi.fn<(state: Partial<SetupState>) => void>();

      await initSetupStart(updateState);

      expect(updateState).toHaveBeenCalledWith(
        expect.objectContaining({
          page: Screen.WAIT,
          waitScreenStatus: SetupStatus.ERROR,
          waitScreenMessage: "Migration data is incomplete. Retry after checking the source disk.",
        }),
      );
      expect(updateState).toHaveBeenCalledTimes(1);
    },
  );

  it("accepts complete migration data", async () => {
    vi.spyOn(instance, "get").mockResolvedValue({
      data: {
        hddGotBlockchain: "1",
        hddGotMigrationData: SetupMigrationOS.UMBREL,
        migrationMode: SetupMigrationMode.NORMAL,
        setupPhase: SetupPhase.MIGRATION,
      },
    });
    const updateState = vi.fn();
    await initSetupStart(updateState);
    expect(updateState).toHaveBeenLastCalledWith(
      expect.objectContaining({
        migrationOS: SetupMigrationOS.UMBREL,
        migrationMode: SetupMigrationMode.NORMAL,
        page: Screen.MIGRATION,
      }),
    );
  });

  it("opens setup only after validating the response", async () => {
    vi.spyOn(instance, "get").mockResolvedValue({
      data: {
        hddGotBlockchain: "0",
        hddGotMigrationData: null,
        migrationMode: null,
        setupPhase: SetupPhase.SETUP,
      },
    });
    const updateState = vi.fn<(state: Partial<SetupState>) => void>();

    await initSetupStart(updateState);

    expect(updateState).toHaveBeenLastCalledWith(
      expect.objectContaining({
        migrationMode: SetupMigrationMode.NULL,
        migrationOS: SetupMigrationOS.NULL,
        page: Screen.SETUP,
        setupPhaseOnStart: SetupPhase.SETUP,
      }),
    );
  });
});

// /setup/status forwards Redis values from raspiblitz/home.admin/_bootstrap.sh.
describe("RaspiBlitz setup status contract", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it.each([
    "starting",
    "system-init",
    "hdd-format",
    "systemcopy",
    "system-change",
    "hdd-migration",
    "waitsync",
    "waitsetup-extended",
    "errorHDD",
    "future-progress-state",
  ])("continues polling through %s", async (state) => {
    vi.useFakeTimers();
    const request = vi
      .spyOn(instance, "get")
      .mockResolvedValueOnce({
        data: {
          setupPhase: "setup",
          state,
          message: "Progress from RaspiBlitz",
          initialsync: "",
        },
      })
      .mockResolvedValueOnce({
        data: {
          setupPhase: "done",
          state: "ready",
          message: "Node Running",
          initialsync: "done",
        },
      });
    const updateState = vi.fn();
    const navigate = vi.fn();
    await setupMonitoringLoop(updateState, navigate);
    expect(updateState).toHaveBeenCalledWith({
      page: Screen.WAIT,
      waitScreenStatus: state,
      waitScreenMessage: "Progress from RaspiBlitz",
    });
    expect(navigate).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(4000);
    expect(request).toHaveBeenCalledTimes(2);
    expect(navigate).toHaveBeenCalledWith("/");
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([null, 1, [], {}, undefined])("rejects a non-string status %s", async (state) => {
    vi.useFakeTimers();
    vi.spyOn(instance, "get").mockResolvedValue({ data: { state } });
    const updateState = vi.fn();
    await setupMonitoringLoop(updateState, vi.fn());
    expect(updateState).toHaveBeenCalledWith(
      expect.objectContaining({
        page: Screen.WAIT,
        waitScreenStatus: SetupStatus.ERROR,
      }),
    );
    expect(vi.getTimerCount()).toBe(0);
  });
});
