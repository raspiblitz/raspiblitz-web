import type { FC } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfirmModal,
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import type { Transaction } from "@/models/transaction.model";
import TransactionDetails from "./TransactionDetails";

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
    return null;
  }

  return (
    <ConfirmModal disclosure={disclosure} custom>
      <ConfirmModal.Header>{t("tx.tx_details")}</ConfirmModal.Header>
      <ConfirmModal.Body>
        <TransactionDetails details={transaction} />
      </ConfirmModal.Body>
    </ConfirmModal>
  );
};

export default TransactionDetailModal;
