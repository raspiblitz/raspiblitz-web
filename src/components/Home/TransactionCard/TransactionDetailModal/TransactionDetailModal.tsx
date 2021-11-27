import { FC } from "react";
import { useTranslation } from "react-i18next";
import ModalDialog from "../../../../container/ModalDialog/ModalDialog";
import { Transaction } from "../../../../models/transaction.model";
import LNDetails from "./LNDetails/LNDetails";
import OnchainDetails from "./OnchainDetails/OnchainDetails";

export const TransactionDetailModal: FC<TransactionDetailModalProps> = (
  props
) => {
  const { t } = useTranslation();
  const { transaction } = props;

  return (
    <ModalDialog close={props.close}>
      <section className="flex flex-col">
        <h4 className="font-extrabold">{t("tx.tx_details")}</h4>
        {transaction?.category === "onchain" && (
          <OnchainDetails details={transaction} />
        )}
        {transaction?.category === "ln" && <LNDetails details={transaction} />}
      </section>
    </ModalDialog>
  );
};

export default TransactionDetailModal;

export interface TransactionDetailModalProps {
  transaction: Transaction;
  close: () => void;
}
