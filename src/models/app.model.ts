import { FC } from "react";

export interface App {
  id: string;
  name: string;
  author: string;
  repository: string;
  // allow any props
  customComponent?: FC<any>;
}
