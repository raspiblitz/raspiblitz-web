export interface AppStatus {
  id: string;
  status: "online" | "offline";
  address?: string;
  hiddenService?: string;
}
