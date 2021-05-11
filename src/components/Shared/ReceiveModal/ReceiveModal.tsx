import QRCode from 'qrcode.react';
import { FC, useState } from 'react';
import { ReactComponent as XIcon } from '../../../assets/X.svg';
import ModalBackground from '../../../container/ModalBackground/ModalBackground';

const ReceiveModal: FC<ReceiveModalProps> = (props) => {
  const [buttonText, setButtonText] = useState('Copy');
  const [address, setAddress] = useState('');

  const generateAddressHandler = () => {
    // Get LN Invoice or on-chain address
  };

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(address);
    setButtonText('✅ Copied to Clipboard');

    setTimeout(() => {
      setButtonText('Copy');
    }, 3000);
  };

  return (
    <ModalBackground>
      <div className='w-4/5 h-auto lg:w-1/2 xl:w-2/5 xl:max-w-screen-sm bg-white text-center rounded-lg flex flex-col mx-5 dark:bg-gray-800 dark:text-white'>
        <div className='flex'>
          <button onClick={props.close} className='flex items-end ml-auto h-7 w-7 mt-1'>
            <XIcon className='w-full h-full' />
          </button>
        </div>
        <div className='px-5'>
          <div className='text-xl font-bold'>Receive Funds</div>
          <div className='my-5'>Scan this QR Code or copy the below address to receive funds</div>
          <div className='my-5 flex justify-center'>{address && <QRCode value={address} />}</div>
          <div className='flex flex-col items-center'>
            <div className='w-full overflow-x-auto my-2'>{address}</div>
            <div className='w-4/5 mb-5'>
              <button
                onClick={copyToClipboardHandler}
                className='text-center h-10 bg-blue-500 hover:bg-blue-600 dark:hover:bg-blue-400 rounded-lg w-full text-white'
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ModalBackground>
  );
};

export default ReceiveModal;

export interface ReceiveModalProps {
  close: () => void;
}
