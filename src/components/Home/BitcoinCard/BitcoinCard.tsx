import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const BitcoinCard: FC<BitcoinCardProps> = (props) => {
  const { t } = useTranslation();
  const syncPercentage = +((props.currBlock / props.maxBlock) * 100).toFixed(2);

  return (
    <div className='p-5 h-full'>
      <div className='bd-card transition-colors'>
        <h2 className='font-bold text-lg'>{t('home.bitcoin')}</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.version')}</h4>
            <div>{props.version}</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.network')}</h4>
            <div>{props.network}</div>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.status')}</h4>
            <div>
              {props.status} ({syncPercentage} %)
            </div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.blocks_synced')}</h4>
            <div>{`${props.currBlock} / ${props.maxBlock}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BitcoinCard;

export interface BitcoinCardProps {
  version: string;
  status: string;
  network: string;
  currBlock: number;
  maxBlock: number;
}
