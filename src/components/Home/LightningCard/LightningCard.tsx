import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../store/app-context';
import LoadingBox from '../../Shared/LoadingBox/LoadingBox';

export const LightningCard: FC<LightningCardProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);

  const { channelBalance, version, channelOnline, channelTotal, status } = props;

  if (!channelBalance || !version || !channelOnline || !channelTotal || !status) {
    return <LoadingBox />;
  }

  const balance = appCtx.unit === 'BTC' ? channelBalance : channelBalance * 100_000_000;

  return (
    <div className='h-full p-5'>
      <div className='bd-card'>
        <h2 className='font-bold text-lg'>{t('home.lightning')}</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.version')}</h6>
            <p>{version}</p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.status')}</h6>
            <p>{status}</p>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.channel')}</h6>
            <p>{`${channelOnline} / ${channelTotal}`}</p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.channel_balance')}</h6>
            <p>
              {balance.toLocaleString()} {appCtx.unit}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightningCard;

export interface LightningCardProps {
  version: string;
  status: string;
  channelOnline: number;
  channelTotal: number;
  channelBalance: number;
}
