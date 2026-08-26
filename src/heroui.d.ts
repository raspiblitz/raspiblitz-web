import type { Key } from "react";
import "@heroui/react/tabs";

declare module "@heroui/react/tabs" {
  interface TabPanelProps {
    id?: Key;
  }
}
