import { FC } from "react";
import { ReactComponent as ChainIcon } from "../../../../assets/chain.svg";
import { ReactComponent as ClockIcon } from "../../../../assets/clock.svg";
import { ReactComponent as DotsIcon } from "../../../../assets/dots-horizontal.svg";
import { ReactComponent as LightningIconSolid } from "../../../../assets/lightning.svg";
import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from "../../../../models/transaction.model";

const CategoryIcon: FC<CategoryIconProps> = (props) => {
  const { category, type, status } = props;

  const sendingTx = type === "send";

  const color = sendingTx ? "text-white bg-red-500" : "text-white bg-green-500";

  if (category === "ln") {
    switch (status) {
      case "in_flight":
        return (
          <DotsIcon
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
          <LightningIconSolid className={`h-7 w-7 rounded-full p-1 ${color}`} />
        );
    }
  }

  return <ChainIcon className={`h-7 w-7 rounded-full p-1 ${color}`} />;
};

export interface CategoryIconProps {
  category: TransactionCategory;
  type: TransactionType;
  status: TransactionStatus;
}

export default CategoryIcon;
