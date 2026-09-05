export type InstallAppData = {
  id: string;
  mode: "on" | "off";
  result: "fail" | "win" | "running" | "";
  details: string;
  httpsForced: "0" | "1";
  httpsSelfsigned: "0" | "1";
};
