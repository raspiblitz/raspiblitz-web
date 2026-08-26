import {
  Screen,
  SetupMigrationMode,
  SetupMigrationOS,
  SetupPhase,
  type SetupState,
  SetupStatus,
} from "@/models/setup.model";
import { initSetupStart } from "@/pages/Setup/setup-functions";
import { instance } from "@/utils/interceptor";

describe("initSetupStart", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a recoverable error for incomplete migration data", async () => {
    vi.spyOn(instance, "get").mockResolvedValue({
      data: {
        hddGotBlockchain: "1",
        hddGotMigrationData: SetupMigrationOS.NULL,
        migrationMode: SetupMigrationMode.NORMAL,
        setupPhase: SetupPhase.MIGRATION,
      },
    });
    const updateState = vi.fn<(state: Partial<SetupState>) => void>();

    await initSetupStart(updateState);

    expect(updateState).toHaveBeenCalledWith(
      expect.objectContaining({
        page: Screen.WAIT,
        waitScreenStatus: SetupStatus.ERROR,
      }),
    );
  });

  it("opens setup only after validating the response", async () => {
    vi.spyOn(instance, "get").mockResolvedValue({
      data: {
        hddGotBlockchain: "0",
        hddGotMigrationData: SetupMigrationOS.NULL,
        migrationMode: SetupMigrationMode.NULL,
        setupPhase: SetupPhase.SETUP,
      },
    });
    const updateState = vi.fn<(state: Partial<SetupState>) => void>();

    await initSetupStart(updateState);

    expect(updateState).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: Screen.SETUP,
        setupPhaseOnStart: SetupPhase.SETUP,
      }),
    );
  });
});
