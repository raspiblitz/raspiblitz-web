import SwitchTxType, { TxType } from "../SwitchTxType";
import ConfirmSendModal from "./ConfirmSendModal";
import SendLn, { LnInvoiceForm } from "./SendLN";
import SendOnChain, { SendOnChainForm } from "./SendOnChain";
import ConfirmModal, {
  type Props as ConfirmModalProps,
} from "@/components/ConfirmModal";
import { DecodePayRequest } from "@/models/decode-pay-req";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { AxiosResponse } from "axios";
import { FC, useState } from "react";

interface Props extends Pick<ConfirmModalProps, "disclosure"> {
  lnBalance: number;
  onchainBalance: number;
}

export interface SendLnForm {
  invoiceType: TxType.LIGHTNING;
  invoice: string;
  address: string;
  amount: number;
  comment: string;
  timestamp: number;
  expiry: number;
}

const SendModal: FC<Props> = ({ lnBalance, disclosure, onchainBalance }) => {
  const [invoiceType, setInvoiceType] = useState<TxType>(TxType.LIGHTNING);
  const [confirmData, setConfirmData] = useState<
    SendOnChainForm | SendLnForm | null
  >(null);
  const [isBack, setIsBack] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmLnHandler = async (data: LnInvoiceForm) => {
    setIsLoading(true);
    setIsBack(false);
    setError("");
    await instance
      .get("/lightning/decode-pay-req", {
        params: {
          pay_req: data.invoice,
        },
      })
      .then((resp: AxiosResponse<DecodePayRequest>) => {
        setConfirmData({
          invoiceType: TxType.LIGHTNING,
          invoice: data.invoice,
          address: resp.data.payment_addr,
          amount: resp.data.num_msat,
          timestamp: resp.data.timestamp,
          expiry: resp.data.expiry,
          comment: resp.data.description,
        });
      })
      .catch((err) => {
        setError(checkError(err));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmOnChainHandler = (data: SendOnChainForm): void => {
    setIsBack(false);
    setConfirmData(data);
  };

  const backHandler = (data: SendOnChainForm | SendLnForm): void => {
    setIsBack(true);
    setConfirmData(data);
  };

  const changeTransactionHandler = (txType: TxType): void => {
    setInvoiceType(txType);
    setConfirmData(null);
    setError("");
  };

  // confirm send
  if (!isBack && confirmData) {
    return (
      <ConfirmModal
        headline="SEND"
        disclosure={disclosure}
        customContent={
          <ConfirmSendModal
            confirmData={confirmData}
            back={backHandler}
            balance={
              invoiceType === TxType.LIGHTNING ? lnBalance : onchainBalance
            }
            close={disclosure.onClose}
          />
        }
      />
    );
  }

  // Send LN
  if (invoiceType === TxType.LIGHTNING) {
    return (
      <ConfirmModal
        headline="SEND" /////////////////////////????? TODO!!!!!!
        disclosure={disclosure}
        customContent={
          <>
            <SwitchTxType
              invoiceType={invoiceType}
              onTxTypeChange={changeTransactionHandler}
              disabled={loading}
            />

            <SendLn
              loading={loading}
              onConfirm={confirmLnHandler}
              lnBalance={lnBalance}
              confirmData={confirmData}
              error={error}
            />
          </>
        }
      />
    );
  }

  // Send On-Chain
  return (
    <ConfirmModal
      headline="SEND"
      disclosure={disclosure}
      customContent={
        <>
          <SwitchTxType
            invoiceType={invoiceType}
            onTxTypeChange={changeTransactionHandler}
            disabled={loading}
          />

          <SendOnChain
            balance={onchainBalance}
            confirmData={confirmData}
            onConfirm={confirmOnChainHandler}
          />
        </>
      }
    />
  );
};

export default SendModal;
