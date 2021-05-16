import { FC } from 'react';

export const OnchainDetails: FC<OnchainDetailProps> = (props) => {
  const details = props.details;

  return (
    <>
      <div className='p-2'>
        <div className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>TxID</div>
        <div className='mt-0 block w-full overflow-x-auto break-normal border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'>
          {details.hash}
        </div>
      </div>
      <div className='p-2'>
        <div className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>Confirmations</div>
        <div className='mt-0 overflow-x-auto break-normal border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'>
          {details.confirmations}
        </div>
      </div>
      <div className='p-2'>
        <div className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>Date</div>
        <div className='mt-0 overflow-x-auto break-normal border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'>
          {details.date}
        </div>
      </div>
      <div className='p-2'>
        <div className='block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2 text-left'>Block</div>
        <div className='mt-0 overflow-x-auto break-normal border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-black'>
          {details.block}
        </div>
      </div>
    </>
  );
};

export default OnchainDetails;

export interface OnchainDetailProps {
  details: OnchainTx;
}

export interface OnchainTx {
  type: string;
  hash: string;
  confirmations: number;
  date: number;
  block: number;
  feeRate: number;
  fee: number;
  description?: string;
}
