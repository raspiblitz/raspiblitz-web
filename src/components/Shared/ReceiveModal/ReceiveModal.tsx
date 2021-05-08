import QRCode from 'qrcode.react';
import { useState } from 'react';
import { ReactComponent as XIcon } from '../../../assets/X.svg';
import ModalBackground from '../../../container/ModalBackground/ModalBackground';

const ReceiveModal = (props: any) => {
  const [buttonText, setButtonText] = useState('Copy');

  const copyToClipboardHandler = () => {
    navigator.clipboard.writeText(props.address);
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
          <div className='my-5 flex justify-center'>
            <QRCode value={props.address} />
          </div>
          <div className='flex flex-col items-center'>
            <div className='w-full overflow-x-auto my-2'>{props.address ? props.address : 'Loading address ...'}</div>
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
