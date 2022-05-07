import { ChangeEvent, FC, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ModalDialog from "../../../container/ModalDialog/ModalDialog";
import { AppContext, Unit } from "../../../store/app-context";
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
  const { unit } = useContext(AppContext);
  const { t } = useTranslation();

  const [invoiceType, setInvoiceType] = useState<TxType>(TxType.LIGHTNING);
  const [invoice, setInvoice] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState("");
  const [comment, setComment] = useState("");
  const [timestamp, setTimestamp] = useState(0);
  const [expiry, setExpiry] = useState(0);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const confirmLnHandler = async () => {
    setIsLoading(true);
    setError("");
    await instance
      .get("/lightning/decode-pay-req?pay_req=" + invoice)
      .then((resp) => {
        setAmount(resp.data.num_satoshis);
        setComment(resp.data.description);
        setTimestamp(resp.data.timestamp);
        setExpiry(resp.data.expiry);
        setConfirm(true);
      })
      .catch((err) => {
        setError(`${t("login.error")}: ${err.response?.data?.detail}`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const confirmOnChainHandler = () => {
    setConfirm(true);
  };

  const changeTransactionHandler = (txType: TxType) => {
    setInvoiceType(txType);
    setInvoice("");
    setAddress("");
    setAmount(0);
    setFee("");
    setComment("");
    setError("");
  };

  const changeAddressHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
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
    unit === Unit.BTC
      ? convertToString(unit, convertMSatToBtc(lnBalance))
      : convertToString(unit, convertMSatToSat(lnBalance));

  // confirm send
  if (confirm) {
    const addr = invoiceType ? invoice : address;
    return (
      <ModalDialog close={() => onClose(false)}>
        <ConfirmSendModal
          address={addr}
          back={() => setConfirm(false)}
          balance={lnBalance}
          close={onClose}
          comment={comment}
          expiry={expiry}
          fee={fee}
          invoiceAmount={amount}
          invoiceType={invoiceType}
          timestamp={timestamp}
        />
      </ModalDialog>
    );
  }

  // Send LN
  if (invoiceType) {
    return createPortal(
      <ModalDialog close={() => onClose(false)} closeable={!loading}>
        <div className="my-3">
          <SwitchTxType
            invoiceType={invoiceType}
            onTxTypeChange={changeTransactionHandler}
            disabled={loading}
          />
        </div>

        <SendLn
          loading={loading}
          onChangeInvoice={changeInvoiceHandler}
          onConfirm={confirmLnHandler}
          balanceDecorated={convertedLnBalance}
          error={error}
        />
      </ModalDialog>,
      MODAL_ROOT
    );
  }

  // Send On-Chain
  return createPortal(
    <ModalDialog close={() => onClose(false)}>
      <div className="my-3">
        <SwitchTxType
          invoiceType={invoiceType}
          onTxTypeChange={changeTransactionHandler}
          disabled={loading}
        />
      </div>

      <SendOnChain
        address={address}
        amount={amount}
        balance={onchainBalance}
        comment={comment}
        fee={fee}
        onChangeAddress={changeAddressHandler}
        onChangeComment={changeCommentHandler}
        onChangeFee={changeFeeHandler}
        onConfirm={confirmOnChainHandler}
      />
    </ModalDialog>,
    MODAL_ROOT
  );
};

export default SendModal;
