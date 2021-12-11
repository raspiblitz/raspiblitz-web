import { ChangeEvent, FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { AppContext } from "../../../store/app-context";
import {
  convertMSatToBtc,
  convertMSatToSat,
  convertToString,
} from "../../../util/format";
import { instance } from "../../../util/interceptor";
import { MODAL_ROOT } from "../../../util/util";
import SwitchTxType, { TxType } from "../SwitchTxType/SwitchTxType";
import ConfirmSendModal from "./ConfirmSendModal/ConfirmSendModal";
import SendLn from "./SendLN/SendLN";
import SendOnChain from "./SendOnChain/SendOnChain";

type Props = {
  lnBalance: number;
  onchainBalance: number;
  onClose: (confirmed: boolean) => void;
};

const SendModal: FC<Props> = ({ lnBalance, onClose, onchainBalance }) => {
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
    setLnTransaction(txType === TxType.LIGHTNING);
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

  const convertedLnBalance =
    appCtx.unit === "BTC"
      ? convertToString(appCtx.unit, convertMSatToBtc(lnBalance))
      : convertToString(appCtx.unit, convertMSatToSat(lnBalance));

  if (confirm) {
    const addr = lnTransaction ? invoice : address;
    return (
      <ModalDialog close={() => onClose(false)}>
        <ConfirmSendModal
          address={addr}
          invoiceAmount={amount}
          back={() => setConfirm(false)}
          balance={lnBalance}
          close={onClose}
          comment={comment}
          fee={fee}
          ln={lnTransaction}
        />
      </ModalDialog>
    );
  }

  return createPortal(
    <ModalDialog close={() => onClose(false)}>
      <div className="my-3">
        <SwitchTxType onTxTypeChange={changeTransactionHandler} />
      </div>

      {lnTransaction && (
        <SendLn
          onChangeInvoice={changeInvoiceHandler}
          onConfirm={confirmLnHandler}
          balanceDecorated={convertedLnBalance}
        />
      )}

      {!lnTransaction && (
        <SendOnChain
          address={address}
          amount={amount}
          balance={onchainBalance}
          comment={comment}
          fee={fee}
          onChangeAddress={changeAddressHandler}
          onChangeAmount={changeAmountHandler}
          onChangeComment={changeCommentHandler}
          onChangeFee={changeFeeHandler}
          onConfirm={confirmOnChainHandler}
        />
      )}
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default SendModal;
