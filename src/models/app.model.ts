export interface App {
  id: string;
  name: string;
  description: string;
  installed: boolean;
  address?: string;
  hiddenService?: string;
}
