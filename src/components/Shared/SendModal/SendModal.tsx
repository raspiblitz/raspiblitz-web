import { ChangeEvent, FC, useContext, useState } from "react";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { AppContext } from "../../../store/app-context";
import { instance } from "../../../util/interceptor";
import ConfirmSendModal from "./ConfirmSendModal/ConfirmSendModal";
import SendLn from "./SendLN/SendLN";
import SwitchTxType, { TxType } from "../SwitchTxType/SwitchTxType";
import SendOnChain from "./SendOnChain/SendOnChain";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertToString,
} from "../../../util/format";

const SendModal: FC<SendModalProps> = (props) => {
  const appCtx = useContext(AppContext);

  const [lnTransaction, setLnTransaction] = useState(true);
  const [invoice, setInvoice] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState("");
  const [comment, setComment] = useState("");

  // TODO: handle error
  const confirmLnHandler = async () => {
    const resp = await instance.get(
      "/lightning/decode-pay-req?pay_req=" + invoice
    );
    setAmount(resp.data.num_satoshis);
    setComment(resp.data.description);
    setConfirm(true);
  };

  const confirmOnChainHandler = () => {
    setConfirm(true);
  };

  const changeTransactionHandler = (txType: TxType) => {
    setLnTransaction(txType === TxType.lightning);
    setInvoice("");
    setAddress("");
    setAmount(0);
    setFee("");
    setComment("");
  };

  const changeAddressHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const changeAmountHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const changeCommentHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const changeFeeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setFee(event.target.value);
  };

  const changeInvoiceHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInvoice(event.target.value);
  };

  const lnBalance =
    appCtx.unit === "BTC"
      ? convertToString(appCtx.unit, convertMSatToBtc(props.lnBalance))
      : convertToString(appCtx.unit, convertMSatToSat(props.lnBalance));

  if (confirm) {
    const addr = lnTransaction ? invoice : address;
    return (
      <ModalDialog close={() => props.onClose(false)}>
        <ConfirmSendModal
          ln={lnTransaction}
          back={() => setConfirm(false)}
          amount={amount.toString()}
          address={addr}
          fee={fee}
          comment={comment}
          close={props.onClose}
        />
      </ModalDialog>
    );
  }

  return (
    <ModalDialog close={() => props.onClose(false)}>
      <div className="my-3">
        <SwitchTxType getTxType={changeTransactionHandler} />
      </div>

      {lnTransaction && (
        <SendLn
          onChangeInvoice={changeInvoiceHandler}
          onConfirm={confirmLnHandler}
          balance={lnBalance}
        />
      )}

      {!lnTransaction && (
        <SendOnChain
          balance={props.onchainBalance}
          address={address}
          onChangeAddress={changeAddressHandler}
          amount={amount}
          onChangeAmount={changeAmountHandler}
          fee={fee}
          onChangeFee={changeFeeHandler}
          comment={comment}
          onChangeComment={changeCommentHandler}
          onConfirm={confirmOnChainHandler}
        />
      )}
    </ModalDialog>
  );
};

export default SendModal;

export interface SendModalProps {
  onchainBalance: number;
  lnBalance: number;
  onClose: (confirmed: boolean) => void;
}
