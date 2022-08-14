import {
  ClockIcon,
  DotsHorizontalIcon,
  LinkIcon,
} from "@heroicons/react/outline";
import { LightningBoltIcon } from "@heroicons/react/solid";
import { FC } from "react";
import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "../../../models/transaction.model";

export type Props = {
  category: TransactionCategory;
  type: TransactionType;
  status: TransactionStatus;
};

const CategoryIcon: FC<Props> = ({ category, type, status }) => {
  const sendingTx = type === "send";

  const color = sendingTx ? "text-white bg-red-500" : "text-white bg-green-500";

  if (category === "ln") {
    switch (status) {
      case "in_flight":
        return (
          <DotsHorizontalIcon
            className={`h-7 w-7 rounded-full bg-gray-500 p-1 text-white`}
          />
        );
      case "failed":
        return (
          <ClockIcon
            className={`h-7 w-7 rounded-full bg-gray-500 p-1 text-white`}
          />
        );
      case "succeeded":
        return (
          <LightningBoltIcon className={`h-7 w-7 rounded-full p-1 ${color}`} />
        );
    }
  }

  return (
    <LinkIcon
      className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
    />
  );
};

export default CategoryIcon;
