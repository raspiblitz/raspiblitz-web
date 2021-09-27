import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ClipboardIcon } from '../../../../../assets/clipboard-copy.svg';

export const LNDetails: FC<LNDetailProps> = (props) => {
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
        <div className={keyClasses}>{t('tx.request')}</div>
        <div className={valueClasses}>{details.request}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('home.status')}</div>
        <div className={valueClasses}>{details.status}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.date')}</div>
        <div className={valueClasses}>{date}</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.fee')}</div>
        <div className={valueClasses}>{details.fee} mSat</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.value')}</div>
        <div className={valueClasses}>{details.value} mSat</div>
      </div>
      <div className={containerClasses}>
        <div className={keyClasses}>{t('tx.description')}</div>
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
