import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "@/models/transaction.model";
import {
  Confirmations0Icon,
  Confirmations1Icon,
  Confirmations2Icon,
  Confirmations3Icon,
  Confirmations4Icon,
  Confirmations5Icon,
  Confirmations6Icon,
} from "@bitcoin-design/bitcoin-icons-react/filled";
import {
  ClockIcon,
  EllipsisHorizontalIcon,
  BoltIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import type { FC } from "react";

export type Props = {
  category: TransactionCategory;
  type: TransactionType;
  status: TransactionStatus;
  confirmations?: number;
};

const CategoryIcon: FC<Props> = ({ category, type, status, confirmations }) => {
  const sendingTx = type === "send";
  const color = sendingTx ? "text-white bg-red-500" : "text-white bg-green-500";

  if (category === "ln") {
    switch (status) {
      case "in_flight":
        return (
          <EllipsisHorizontalIcon
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
        return <BoltIcon className={`h-7 w-7 rounded-full p-1 ${color}`} />;
    }
  }

  switch (confirmations) {
    case 0:
      return (
        <Confirmations0Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 1:
      return (
        <Confirmations1Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 2:
      return (
        <Confirmations2Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 3:
      return (
        <Confirmations3Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 4:
      return (
        <Confirmations4Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 5:
      return (
        <Confirmations5Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    case 6:
      return (
        <Confirmations6Icon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
    default:
      return (
        <LinkIcon
          className={`h-7 w-7 rotate-45 transform rounded-full p-1 ${color}`}
        />
      );
  }
};

export default CategoryIcon;
