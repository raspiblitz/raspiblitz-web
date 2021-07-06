import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const ConnectionCard: FC<ConnectionCardProps> = (props) => {
  const { t } = useTranslation();
  return (
    <div className='p-5 h-full'>
      <div className='bd-card transition-colors'>
        <div className='font-bold text-lg'>{t('home.conn_details')}</div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500 dark:text-gray-200'>{t('home.tor')}</div>
          <a
            className='overflow-hidden overflow-ellipsis text-blue-400 underline'
            href={`//${props.torAddress}`}
            target='_blank'
            rel='noreferrer'
          >
            {props.torAddress}
          </a>
        </div>
        <div className='flex flex-col overflow-hidden py-4'>
          <div className='text-sm text-gray-500 dark:text-gray-200'>{t('home.ssh')}</div>
          <div>{props.sshAddress}</div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionCard;

export interface ConnectionCardProps {
  torAddress: string;
  sshAddress: string;
}
