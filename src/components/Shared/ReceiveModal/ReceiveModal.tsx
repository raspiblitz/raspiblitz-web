import QRCode from 'qrcode.react';
import { ChangeEvent, FC, FormEvent, useState } from 'react';
import { ReactComponent as XIcon } from '../../../assets/X.svg';
import ModalBackground from '../../../container/ModalBackground/ModalBackground';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const ReceiveModal: FC<ReceiveModalProps> = (props) => {
  const [invoiceType, setInvoiceType] = useState('lightning');
  const [buttonText, setButtonText] = useState('Copy to Clipboard');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const lnInvoice = invoiceType === 'lightning';

  const btnClasses =
    'text-center h-10 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg w-full text-white';

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
    const resp = await fetch('http://localhost:8081/receive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    const respObj = await resp.json();
    setIsLoading(false);
    setAddress(respObj.address);
  };

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(address);
    setButtonText('✅ Copied!');

    setTimeout(() => {
      setButtonText('Copy to Clipboard');
    }, 3000);
  };

  const showLnInvoice = lnInvoice && !isLoading && !address;

  return (
    <ModalBackground>
      <div className='w-4/5 h-auto lg:w-1/2 xl:w-2/5 xl:max-w-screen-sm bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-800 dark:text-white'>
        <div className='flex'>
          <button onClick={props.close} className='flex items-end ml-auto h-7 w-7 mt-1'>
            <XIcon className='w-full h-full' />
          </button>
        </div>
        <div className='px-5'>
          <div className='text-xl font-bold'>Create a Receive Address</div>
          <div onChange={invoiceChangeHandler}>
            <input type='radio' id='ln' name='invoiceType' defaultChecked value='lightning' />
            <label htmlFor='ln'>Lightning</label>
            <input type='radio' id='onchain' name='invoiceType' value='onchain' />
            <label htmlFor='onchain'>On-Chain</label>
          </div>
          {address && <div className='my-5'>Scan this QR Code or copy the below address to receive funds</div>}
          {address && (
            <div className='my-5 flex justify-center'>
              <QRCode value={address} />
            </div>
          )}
          <form className='flex flex-col items-center' onSubmit={generateAddressHandler}>
            <div className='w-full overflow-x-auto my-2'>{address}</div>
            <div className='w-4/5 mb-5'>
              {isLoading && (
                <div className='p-5'>
                  <LoadingSpinner color='text-blue-500' />
                </div>
              )}
              {showLnInvoice && (
                <div className='flex flex-col py-5'>
                  <div className='flex justify-center'>
                    <label htmlFor='amount' className='w-1/2'>
                      Amount
                    </label>
                    <input
                      id='amount'
                      type='number'
                      value={amount}
                      onChange={amountChangeHandler}
                      className='border border-gray-400 outline-none rounded-lg'
                    />
                  </div>
                  <div className='flex justify-center py-5'>
                    <label htmlFor='comment' className='w-1/2'>
                      Comment
                    </label>
                    <input
                      id='comment'
                      type='text'
                      value={comment}
                      onChange={commentChangeHandler}
                      className='border border-gray-400 outline-none rounded-lg'
                    />
                  </div>
                </div>
              )}

              {!address && (
                <button type='submit' className={btnClasses}>
                  Generate Address
                </button>
              )}

              {address && (
                <button type='button' onClick={copyToClipboardHandler} className={btnClasses}>
                  {buttonText}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </ModalBackground>
  );
};

export default ReceiveModal;

export interface ReceiveModalProps {
  close: () => void;
}
