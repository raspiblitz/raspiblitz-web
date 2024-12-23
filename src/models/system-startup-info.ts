export interface SystemStartupInfo {
  bitcoin: "offline" | "done";
  bitcoin_msg: string;
  lightning:
    | "offline"
    | "bootstrapping"
    | "bootstrapping_after_unlock"
    | "locked"
    | "disabled"
    | "done";
  lightning_msg: string;
}
