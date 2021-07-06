import QRCode from 'qrcode.react';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModalDialog from '../../../container/ModalDialog/ModalDialog';
import { createRequest } from '../../../util/util';
import AmountInput from '../AmountInput/AmountInput';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ReceiveModal: FC<ReceiveModalProps> = (props) => {
  const { t } = useTranslation();
  const [invoiceType, setInvoiceType] = useState('lightning');
  const [buttonText, setButtonText] = useState('Copy to Clipboard');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const lnInvoice = invoiceType === 'lightning';

  const btnClasses = 'text-center h-10 bg-yellow-500 hover:bg-yellow-400 rounded-lg w-full text-white';

  const invoiceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setInvoiceType(event.target.value);
    setAddress('');
    setAmount(0);
    setComment('');
  };

  const commentChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const amountChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(+event.target.value);
  };

  const generateAddressHandler = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const body = {
      type: invoiceType,
      amount: lnInvoice ? amount : undefined,
      comment: lnInvoice ? comment : undefined
    };
    const req = createRequest('receive', 'POST', JSON.stringify(body));
    const resp = await fetch(req);
    const respObj = await resp.json();
    setIsLoading(false);
    setAddress(respObj.address);
  };

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(address);
    setButtonText('✅ ' + t('wallet.copied'));

    setTimeout(() => {
      setButtonText(t('wallet.copy_clipboard'));
    }, 3000);
  };

  const showLnInvoice = lnInvoice && !isLoading && !address;

  const radioStyles =
    'px-3 py-2 shadow-md rounded-lg hover:text-white hover:bg-yellow-400 dark:hover:bg-yellow-400 dark:text-white dark:bg-gray-600';
  const lnStyle = invoiceType === 'lightning' ? 'text-white bg-yellow-500 dark:bg-yellow-500' : '';
  const walletStyle = invoiceType === 'onchain' ? 'text-white bg-yellow-500 dark:bg-yellow-500' : '';

  return (
    <ModalDialog close={props.onClose}>
      {showLnInvoice && <div className='text-xl font-bold'>{t('wallet.create_invoice_ln')}</div>}
      {!showLnInvoice && <div className='text-xl font-bold'>{t('wallet.fund')}</div>}
      <div className='pt-5 pb-1 flex justify-center'>
        <div className='px-2'>
          <label htmlFor='lightning' className={`${radioStyles} ${lnStyle}`}>
            {t('home.lightning')}
          </label>
          <input
            id='lightning'
            type='radio'
            className='hidden'
            name='invoiceType'
            value='lightning'
            onChange={invoiceChangeHandler}
          />
        </div>
        <div className='px-2'>
          <label htmlFor='onchain' className={`${radioStyles} ${walletStyle}`}>
            {t('wallet.fund_short')}
          </label>
          <input
            id='onchain'
            type='radio'
            className='hidden'
            name='invoiceType'
            value='onchain'
            onChange={invoiceChangeHandler}
          />
        </div>
      </div>
      {address && <div className='my-5'>{t('wallet.scan_qr')}</div>}
      {address && (
        <div className='my-5 flex justify-center'>
          <QRCode value={address} />
        </div>
      )}
      <form className='flex flex-col items-center' onSubmit={generateAddressHandler}>
        <div className='w-full overflow-x-auto m-2'>{address}</div>
        <div className='w-4/5 mb-5'>
          {isLoading && (
            <div className='p-5'>
              <LoadingSpinner />
            </div>
          )}
          {showLnInvoice && (
            <div className='flex flex-col pb-5 justify-center text-center'>
              <AmountInput amount={amount} onChangeAmount={amountChangeHandler} />
              <div className='flex flex-col justify-center mt-2'>
                <label
                  htmlFor='comment'
                  className='block text-gray-700 dark:text-gray-300 text-sm mb-2 font-bold text-left'
                >
                  Comment
                </label>
                <input
                  id='comment'
                  type='text'
                  placeholder='Optional comment'
                  value={comment}
                  onChange={commentChangeHandler}
                  className='input-underline'
                />
              </div>
            </div>
          )}

          {!address && (
            <button type='submit' className={btnClasses}>
              {showLnInvoice && 'Create Invoice'}
              {!showLnInvoice && 'Generate Address'}
            </button>
          )}

          {address && (
            <button type='button' onClick={copyToClipboardHandler} className={btnClasses}>
              {buttonText}
            </button>
          )}
        </div>
      </form>
    </ModalDialog>
  );
};

export default ReceiveModal;

export interface ReceiveModalProps {
  onClose: () => void;
}
