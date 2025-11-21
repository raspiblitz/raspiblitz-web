import type { FC } from "react";

export interface App {
  id: string;
  name: string;
  author: string;
  repository: string;
  // biome-ignore lint/suspicious/noExplicitAny: value is expected to exist at this point
  customComponent?: FC<any>;
}
