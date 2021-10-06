import { FC, FormEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as CheckIcon } from '../../../../assets/check.svg';
import { ReactComponent as XIcon } from '../../../../assets/X.svg';
import { AppContext } from '../../../../store/app-context';
import { instance } from '../../../../util/interceptor';
import { ReactComponent as ChevronLeft } from '../../../../assets/chevron-left.svg';

const ConfirmSendModal: FC<ConfirmSendModalProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);
  const { ln, amount, address, fee, comment } = props;

  // TODO: handle error
  const sendTransactionHandler = async (event: FormEvent) => {
    event.preventDefault();
    let response;
    if (ln) {
      response = await instance.post('lightning/send-payment?pay_req=' + address).catch((e) => {
        return e;
      });
    } else {
      const body = {
        amount,
        address,
        sat_per_vbyte: fee,
        label: comment,
        unit: appCtx.unit
      };
      response = await instance.post('lightning/send-coins', body).catch((e) => {
        return e;
      });
    }

    console.log(response);
    props.close(true);
  };

  const addressTitle = ln ? t('wallet.invoice') : t('wallet.address');

  const commentHeading = ln ? t('tx.description') : t('tx.comment');

  return (
    <section className='break-all'>
      <button onClick={props.back} className='flex items-center justify-center outline-none font-bold'>
        <ChevronLeft className='h-4 w-4 inline-block' />
        {t('navigation.back')}
      </button>
      <h4 className='my-3 break-normal font-extrabold'>{t('tx.confirm_info')}: </h4>
      <article className='my-2'>
        <h4 className='font-bold'>{addressTitle}:</h4> {address}
      </article>
      <article className='my-2'>
        <h4 className='font-bold'>{t('wallet.amount')}:</h4> {amount} Sat
      </article>
      {!ln && (
        <article className='my-2'>
          <h4 className='font-bold'>{t('tx.fee')}:</h4> {fee} sat/vByte
        </article>
      )}
      {comment && (
        <article className='my-2'>
          <h4 className='font-bold'>{commentHeading}:</h4> {comment}
        </article>
      )}
      <div className='flex justify-around px-2 py-5'>
        <button
          className='shadow-xl rounded text-white bg-red-500 hover:bg-red-400 py-2 px-3 flex'
          onClick={() => props.close(false)}
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
  );
};

export interface ConfirmSendModalProps {
  ln: boolean;
  amount: string;
  address: string;
  fee: string;
  comment: string;
  back: () => void;
  close: (confirmed: boolean) => void;
}

export default ConfirmSendModal;
