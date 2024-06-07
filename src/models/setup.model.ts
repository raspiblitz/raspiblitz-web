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
