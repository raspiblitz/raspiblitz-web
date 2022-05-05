export enum SetupPhase {
  NULL = "",
  DONE = "done",
  SETUP = "setup",
  RECOVERY = "recovery",
  UPDATE = "update",
  MIGRATION = "migration",
}

export enum SetupStatus {
  NULL = "",
  WAIT = "wait",
  ERROR = "error",
  WAITSETUP = "waitsetup",
  WAITFINAL = "waitfinal",
  WAITPROVISION = "waitprovision",
  PROVISION = "provision",
  READY = "ready",
  SHUTDOWN = "shutdown",
  REBOOT = "reboot",
}

export enum SetupLightning {
  NULL = "",
  NONE = "none",
  LND = "lnd",
  CLIGHTNING = "cl",
}

export enum SetupMigrationOS {
  NULL = "",
  UMBREL = "umbrel",
  CITADEL = "citadel",
  MYNODE = "mynode",
}

export enum SetupMigrationMode {
  NULL = "",
  NORMAL = "normal",
  OUTDATED = "outdatedLightning",
}
