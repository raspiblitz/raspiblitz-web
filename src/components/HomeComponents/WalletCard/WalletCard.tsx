import { FC } from 'react';
import { ReactComponent as ChainIcon } from '../../../assets/chain.svg';
import { ReactComponent as LightningIcon } from '../../../assets/lightning.svg';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';

export const WalletCard: FC<WalletCardProps> = (props) => {
  return (
    <div className='p-5 h-full'>
      <div className='bd-card h-full'>
        <div className='text-black flex flex-col lg:flex-row flex-wrap p-5'>
          <div className='bg-yellow-300 w-full rounded-xl p-4'>
            <div className='w-full flex flex-col'>
              <span className='text-xl'>Wallet</span>
              <span className='text-2xl font-bold'>1.21212121 BTC</span>
            </div>
            <div className='w-full flex flex-col'>
              <span>
                <ChainIcon className='inline h-5 w-5' />
                &nbsp;On-Chain
              </span>
              <span className='text-lg font-bold'>1.21212121 BTC</span>
            </div>
            <div className='w-full flex flex-col'>
              <span>
                <LightningIcon className='inline h-5 w-5' />
                &nbsp;Lightning
              </span>
              <span className='text-lg font-bold'>1.21212121 BTC</span>
            </div>
          </div>
        </div>
        <div className='flex justify-around p-2'>
          <button
            onClick={props.onReceive}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-4 rounded flex justify-center items-center'
          >
            <ReceiveIcon className='h-6 w-6' />
            <span>&nbsp;Receive</span>
          </button>
          <button
            onClick={props.onSend}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-4 rounded flex justify-center items-center'
          >
            <SendIcon className='h-6 w-6' />
            <span>&nbsp;Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;

export interface WalletCardProps {
  onReceive: () => void;
  onSend: () => void;
}
