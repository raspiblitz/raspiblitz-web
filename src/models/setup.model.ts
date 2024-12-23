export enum SetupPhase {
  DONE = "done",
  MIGRATION = "migration",
  NULL = "",
  RECOVERY = "recovery",
  SETUP = "setup",
  UPDATE = "update",
}

export enum SetupStatus {
  ERROR = "error",
  NULL = "",
  PROVISION = "provision",
  READY = "ready",
  REBOOT = "reboot",
  SHUTDOWN = "shutdown",
  WAIT = "wait",
  WAITFINAL = "waitfinal",
  WAITPROVISION = "waitprovision",
  WAITSETUP = "waitsetup",
}

export enum SetupLightning {
  CLIGHTNING = "cl",
  LND = "lnd",
  NONE = "none",
  NULL = "",
}

export enum SetupMigrationOS {
  CITADEL = "citadel",
  MYNODE = "mynode",
  NULL = "",
  UMBREL = "umbrel",
}

export enum SetupMigrationMode {
  NORMAL = "normal",
  NULL = "",
  OUTDATED = "outdatedLightning",
}

export enum Screen {
  FINAL = 0,
  FORMAT = 1,
  INPUT_A = 2,
  INPUT_B = 3,
  INPUT_C = 4,
  INPUT_NODENAME = 5,
  LIGHTNING = 6,
  MIGRATION = 7,
  RECOVERY = 8,
  SETUP = 9,
  START_DONE = 10,
  SYNC = 11,
  WAIT = 12,
}

export interface SetupState {
  page: Screen;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  syncData: any | null;
  waitScreenStatus: SetupStatus;
  waitScreenMessage: string;
  setupPhaseOnStart: SetupPhase;
  setupPhase: SetupPhase;
  gotBlockchain: boolean;
  keepBlockchain: boolean;
  migrationOS: SetupMigrationOS;
  migrationMode: SetupMigrationMode;
  lightning: SetupLightning;
  hostname: string;
  passwordA: string;
  passwordB: string;
  passwordC: string;
  seedWords: string | null;
}

export const initialState: SetupState = {
  page: Screen.WAIT,
  syncData: null,
  waitScreenStatus: SetupStatus.WAIT,
  waitScreenMessage: "",
  setupPhaseOnStart: SetupPhase.NULL,
  setupPhase: SetupPhase.NULL,
  gotBlockchain: false,
  keepBlockchain: true,
  migrationOS: SetupMigrationOS.NULL,
  migrationMode: SetupMigrationMode.NULL,
  lightning: SetupLightning.NULL,
  hostname: "",
  passwordA: "",
  passwordB: "",
  passwordC: "",
  seedWords: null,
};
