import { ChangeEvent, FC, FormEvent, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../../store/app-context';

const SendLn: FC<SendLnProps> = (props) => {
  const appCtx = useContext(AppContext);
  const { balance, onChangeInvoice, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <form onSubmit={onConfirm}>
      <h3 className='text-xl font-bold'>{t('wallet.send_lightning')}</h3>
      <div className='my-5'>
        <span className='font-bold'>{t('wallet.balance')}:&nbsp;</span>
        {balance} {appCtx.unit}
      </div>
      <label className='label-underline' htmlFor='invoiceInput'>
        {t('wallet.invoice')}
      </label>
      <input id='invoiceInput' type='text' onChange={onChangeInvoice} className='input-underline' />
      <button type='submit' className='bd-button p-3 my-3'>
        Submit
      </button>
    </form>
  );
};

export default SendLn;

export interface SendLnProps {
  balance: string;
  onConfirm: (event: FormEvent) => void;
  onChangeInvoice: (event: ChangeEvent<HTMLInputElement>) => void;
}
