import { FC, FormEvent, useContext } from 'react';
import ModalDialog from '../../../../container/ModalDialog/ModalDialog';
import { AppContext } from '../../../../store/app-context';
import { instance } from '../../../../util/interceptor';
import { ReactComponent as XIcon } from '../../../../assets/X.svg';
import { ReactComponent as CheckIcon } from '../../../../assets/check.svg';
import { useTranslation } from 'react-i18next';

const ConfirmSendModal: FC<ConfirmSendModalProps> = (props) => {
  const { t } = useTranslation();
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
      <section className='break-all'>
        <h4 className='my-3 break-normal font-extrabold'>{t('tx.confirm_info')}: </h4>
        <article className='my-2'>
          <div className='font-bold'>{t('wallet.address')}:</div> {address}
        </article>
        <article className='my-2'>
          <div className='font-bold'>{t('wallet.amount')}:</div> {amount} {appCtx.unit}
        </article>
        <article className='my-2'>
          <div className='font-bold'>{t('tx.fee')}:</div> {fee} sat/vByte
        </article>
        {comment && (
          <article className='my-2'>
            <div className='font-bold'>{t('tx.comment')}:</div> {comment}
          </article>
        )}
        <div className='flex justify-around px-2 py-5'>
          <button
            className='shadow-xl rounded text-white bg-red-500 hover:bg-red-400 py-2 px-3 flex'
            onClick={props.onClose.bind(null, false)}
          >
            <XIcon />
            &nbsp;{t('settings.cancel')}
          </button>
          <button className='bd-button py-2 px-3 flex' onClick={sendTransactionHandler}>
            <CheckIcon />
            &nbsp; {t('settings.confirm')}
          </button>
        </div>
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
