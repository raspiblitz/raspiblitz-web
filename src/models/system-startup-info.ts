export interface SystemStartupInfo {
  bitcoin: "offline" | "done";
  bitcoin_msg: string;
  lightning: "offline" | "bootstrapping" | "locked" | "disabled" | "done";
  lightning_msg: string;
}
