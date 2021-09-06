import { FC, FormEvent, useContext } from 'react';
import ModalDialog from '../../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../../store/app-context';
import { instance } from '../../../../util/interceptor';

const ConfirmSendModal: FC<ConfirmSendModalProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { amount, address, fee, comment } = props;

  const sendTransactionHandler = async (event: FormEvent) => {
    event.preventDefault();
    const body = {
      amount,
      address,
      fee,
      comment,
      unit: appCtx.unit
    };
    const response = await instance.post('send', body).catch((e) => {
      return e;
    });

    console.log(response);
    props.onClose(true);
  };

  return (
    <ModalDialog close={props.onClose.bind(null, false)}>
      <section>
        Please confirm the transaction: <br />
        Address: {address} <br />
        Amount: {amount} <br />
        Fee: {fee} sat/vByte <br />
        Comment: {comment} <br />
        <button onClick={props.onClose.bind(null, false)}>Cancel</button>
        <button onClick={sendTransactionHandler}>Confirm</button>
      </section>
    </ModalDialog>
  );
};

export interface ConfirmSendModalProps {
  amount: string;
  address: string;
  fee: string;
  comment: string;
  onClose: (confirmed: boolean) => void;
}

export default ConfirmSendModal;
