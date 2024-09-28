import LNDetails from "./LNDetails";
import OnchainDetails from "./OnchainDetails";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { Transaction } from "@/models/transaction.model";
import { ModalBody } from "@nextui-org/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props extends Pick<ConfirmModalProps, "disclosure"> {
  transaction: Transaction;
}

export const TransactionDetailModal: FC<Props> = ({
  transaction,
  disclosure,
}) => {
  const { t } = useTranslation();

  // prevent error when closing via 'Esc' key
  if (!transaction) {
    return <></>;
  }

  const { category } = transaction;

  return (
    <ConfirmModal
      disclosure={disclosure}
      headline={t("tx.tx_details")}
      customContent={
        <ModalBody>
          {category === "onchain" && <OnchainDetails details={transaction} />}
          {category === "ln" && <LNDetails details={transaction} />}
        </ModalBody>
      }
    />
  );
};

export default TransactionDetailModal;
