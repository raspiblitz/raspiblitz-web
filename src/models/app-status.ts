export interface AppStatus {
  id: string;
  installed: boolean;
  status: "online" | "offline";
  address?: string;
  hiddenService?: string;
  extra?: any;
}
