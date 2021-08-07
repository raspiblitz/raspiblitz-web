import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import LoadingBox from '../../Shared/LoadingBox/LoadingBox';

export const BitcoinCard: FC<BitcoinCardProps> = (props) => {
  const { t } = useTranslation();
  const { currBlock, maxBlock, version, network, status } = props;

  if (!currBlock || !maxBlock || !version || !network || !status) {
    return <LoadingBox />;
  }

  const syncPercentage = +((currBlock / maxBlock) * 100).toFixed(2);

  return (
    <div className='p-5 h-full'>
      <section className='bd-card'>
        <h2 className='font-bold text-lg'>{t('home.bitcoin')}</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.version')}</h6>
            <p>{version}</p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.network')}</h6>
            <p>{network}</p>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.status')}</h6>
            <p>
              {status} ({syncPercentage} %)
            </p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.blocks_synced')}</h6>
            <p>{`${currBlock} / ${maxBlock}`}</p>
          </div>
        </div>
      </section>
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
