import { AxiosResponse } from "axios";
import { DecodePayRequest } from "models/decode-pay-req";
import { FC, useState } from "react";
import { createPortal } from "react-dom";
import ModalDialog from "../../../layouts/ModalDialog";
import { MODAL_ROOT } from "../../../utils";
import { checkError } from "../../../utils/checkError";
import { instance } from "../../../utils/interceptor";
import SwitchTxType, { TxType } from "../SwitchTxType";
import ConfirmSendModal from "./ConfirmSendModal";
import SendLn, { LnInvoiceForm } from "./SendLN";
import SendOnChain, { SendOnChainForm } from "./SendOnChain";

export type Props = {
  lnBalance: number;
  onchainBalance: number;
  onClose: (confirmed: boolean) => void;
};

export interface SendLnForm {
  invoiceType: TxType.LIGHTNING;
  address: string;
  amount: number;
  comment: string;
  timestamp: number;
  expiry: number;
}

const SendModal: FC<Props> = ({ lnBalance, onClose, onchainBalance }) => {
  const [invoiceType, setInvoiceType] = useState<TxType>(TxType.LIGHTNING);
  const [confirmData, setConfirmData] = useState<
    SendOnChainForm | SendLnForm | null
  >(null);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmLnHandler = async (data: LnInvoiceForm) => {
    setIsLoading(true);
    setError("");
    await instance
      .get("/lightning/decode-pay-req", {
        params: {
          pay_req: data.invoiceInput,
        },
      })
      .then((resp: AxiosResponse<DecodePayRequest>) => {
        const { payment_addr, num_msat, description, timestamp, expiry } =
          resp.data;
        setConfirmData({
          invoiceType: TxType.LIGHTNING,
          address: payment_addr,
          amount: num_msat,
          timestamp,
          expiry,
          comment: description,
        });
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmOnChainHandler = (data: SendOnChainForm) => {
    console.log(data);
    setConfirmData(data);
  };

  const changeTransactionHandler = (txType: TxType) => {
    setInvoiceType(txType);
    setError("");
  };

  // confirm send
  if (confirmData) {
    return (
      <ModalDialog close={() => onClose(false)}>
        <ConfirmSendModal
          confirmData={confirmData}
          back={() => setConfirmData(null)}
          balance={
            invoiceType === TxType.LIGHTNING ? lnBalance : onchainBalance
          }
          close={onClose}
        />
      </ModalDialog>
    );
  }

  // Send LN
  if (invoiceType === TxType.LIGHTNING) {
    return createPortal(
      <ModalDialog close={() => onClose(false)} closeable={!loading}>
        <SwitchTxType
          invoiceType={invoiceType}
          onTxTypeChange={changeTransactionHandler}
          disabled={loading}
        />

        <SendLn
          loading={loading}
          onConfirm={confirmLnHandler}
          lnBalance={lnBalance}
          error={error}
        />
      </ModalDialog>,
      MODAL_ROOT
    );
  }

  // Send On-Chain
  return createPortal(
    <ModalDialog close={() => onClose(false)}>
      <SwitchTxType
        invoiceType={invoiceType}
        onTxTypeChange={changeTransactionHandler}
        disabled={loading}
      />

      <SendOnChain balance={onchainBalance} onConfirm={confirmOnChainHandler} />
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default SendModal;
