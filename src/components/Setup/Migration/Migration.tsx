import { FC } from "react";
import SetupContainer from "../../../container/SetupContainer/SetupContainer";

const Migration: FC<MigrationProps> = (props) => {
  return <SetupContainer>{props.type} Migration</SetupContainer>;
};

export default Migration;

export interface MigrationProps {
  type: "MYNODE" | "UMBREL";
}
