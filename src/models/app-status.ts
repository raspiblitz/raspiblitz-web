export interface AppStatus {
  id: string;
  installed: boolean;
  address?: string;
  hiddenService?: string;
  extra?: any;
}
