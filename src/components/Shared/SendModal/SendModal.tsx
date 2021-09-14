import { ChangeEvent, FC, FormEvent, useContext, useState } from 'react';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../store/app-context';
import { instance } from '../../../util/interceptor';
import ConfirmSendModal from './ConfirmSendModal/ConfirmSendModal';
import SendLn from './SendLN/SendLN';
import SendOnChain from './SendOnChain/SendOnChain';
import { ReactComponent as SwitchIcon } from '../../../assets/switch-vertical.svg';
import { useTranslation } from 'react-i18next';

const SendModal: FC<SendModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { t } = useTranslation();

  const [lnTransaction, setLnTransaction] = useState(true);
  const [invoice, setInvoice] = useState('');
  const [confirm, setConfirm] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState('');
  const [comment, setComment] = useState('');

  const confirmLnHandler = async (event: FormEvent) => {
    event.preventDefault();
    const resp = await instance.post('/lightning/verify', { invoice });
    console.log(resp);
    setAmount(resp.data.amount);
    setComment(resp.data.description);
    setConfirm(true);
  };

  const confirmOnChainHandler = (event: FormEvent) => {
    event.preventDefault();
    setConfirm(true);
  };

  const changeTransactionHandler = () => {
    setLnTransaction((prev) => !prev);
    setInvoice('');
    setAddress('');
    setAmount(0);
    setFee('');
    setComment('');
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

  const onchainBalance =
    appCtx.unit === 'BTC'
      ? props.onchainBalance.toLocaleString()
      : (props.onchainBalance * 100_000_000).toLocaleString();

  const lnBalance =
    appCtx.unit === 'BTC' ? props.lnBalance.toLocaleString() : (props.lnBalance * 100_000_000).toLocaleString();

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
      <button onClick={changeTransactionHandler} className='bd-button p-1 my-3 block'>
        {t('settings.change')} <SwitchIcon className='inline-block p-0.5' />
      </button>
      {lnTransaction && (
        <SendLn onChangeInvoice={changeInvoiceHandler} onConfirm={confirmLnHandler} balance={lnBalance} />
      )}
      {!lnTransaction && (
        <SendOnChain
          balance={onchainBalance}
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
