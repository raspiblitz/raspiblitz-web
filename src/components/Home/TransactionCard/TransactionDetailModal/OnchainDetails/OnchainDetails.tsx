import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ClipboardIcon } from '../../../../../assets/clipboard.svg';

export const OnchainDetails: FC<OnchainDetailProps> = (props) => {
  const { t } = useTranslation();
  const details = props.details;

  const containerClasses = 'm-2 py-1 flex overflow-hidden border-gray-400 border-b-2 text-left';
  const keyClasses = 'w-1/2 text-gray-500 dark:text-gray-200';
  const valueClasses = 'w-1/2 overflow-hidden overflow-ellipsis overflow-x-auto';

  const date = new Date(details.date * 1000).toLocaleString(); // epoch time => * 1000

  const copyClipboardHandler = () => {
    navigator.clipboard.writeText(details.hash);
  };

  return (
    <div className='flex flex-col p-3 my-4'>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.txid')}</div>
        <div className={valueClasses}>{details.hash}</div>
        <div>
          <ClipboardIcon className='h-5 w-5 hover:text-blue-500' onClick={copyClipboardHandler} />
        </div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.confirmations')}</div>
        <div className={valueClasses}>{details.confirmations || 'Unconfirmed'}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.included_block')}</div>
        <div className={valueClasses}>{details.block || 'Unconfirmed'}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.date')}</div>
        <div className={valueClasses}>{date}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.fee')}</div>
        <div className={valueClasses}>{details.fee}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.fee_rate')}</div>
        <div className={valueClasses}>{details.feeRate} sat/vByte</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.desc')}</div>
        <div className={valueClasses}>{details.description}</div>
      </div>
    </div>
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
