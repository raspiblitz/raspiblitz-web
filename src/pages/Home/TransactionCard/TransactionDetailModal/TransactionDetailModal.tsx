import { FC } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ModalDialog from "../../../../layouts/ModalDialog";
import { Transaction } from "../../../../models/transaction.model";
import { MODAL_ROOT } from "../../../../utils";
import LNDetails from "./LNDetails";
import OnchainDetails from "./OnchainDetails";

type Props = {
  transaction: Transaction;
  close: () => void;
};

export const TransactionDetailModal: FC<Props> = ({ transaction, close }) => {
  const { t } = useTranslation();

  // prevent error when closing via 'Esc' key
  if (!transaction) {
    return <></>;
  }

  const { category } = transaction;

  return createPortal(
    <ModalDialog close={close}>
      <section className="flex flex-col">
        <h4 className="font-extrabold">{t("tx.tx_details")}</h4>
        {category === "onchain" && <OnchainDetails details={transaction} />}
        {category === "ln" && <LNDetails details={transaction} />}
      </section>
    </ModalDialog>,
    MODAL_ROOT,
  );
};

export default TransactionDetailModal;
