import { FC } from 'react';

export const LNDetails: FC<LNDetailProps> = (props) => {
  const details = props.details;

  const containerClasses = 'm-2 py-1 flex overflow-hidden border-gray-400 border-b-2 text-left';
  const keyClasses = 'w-1/2 text-gray-500 dark:text-gray-200';
  const valueClasses = 'w-1/2 overflow-hidden overflow-ellipsis overflow-x-auto';

  const date = new Date(details.date * 1000).toLocaleString(); // epoch time => * 1000

  return (
    <div className='flex flex-col p-3 my-4'>
      <div className={containerClasses}>
        <div className={keyClasses}>TxID</div>
        <div className={valueClasses}>{details.hash}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Request</div>
        <div className={valueClasses}>{details.request}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Status</div>
        <div className={valueClasses}>{details.status}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Date</div>
        <div className={valueClasses}>{date}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Fee</div>
        <div className={valueClasses}>{details.fee} mSat</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Value</div>
        <div className={valueClasses}>{details.value} mSat</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>Description</div>
        <div className={valueClasses}>{details.description}</div>
      </div>
    </div>
  );
};

export default LNDetails;

export interface LNDetailProps {
  details: LNTx;
}

export interface LNTx {
  type: string;
  hash: string;
  request: string;
  status: string;
  date: number;
  fee: number;
  value: number;
  description?: string;
}
