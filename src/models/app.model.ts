import type { FC } from "react";

export interface App {
  id: string;
  name: string;
  author: string;
  repository: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  customComponent?: FC<any>;
}
