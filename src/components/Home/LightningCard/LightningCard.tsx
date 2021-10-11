import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContext } from '../../../store/app-context';
import { checkPropsUndefined } from '../../../util/util';
import LoadingBox from '../../Shared/LoadingBox/LoadingBox';

export const LightningCard: FC<LightningCardProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);

  const { channelBalance, version, channelPending, channelActive, channelInactive, status } = props;

  if (checkPropsUndefined(props)) {
    return <LoadingBox />;
  }

  // remove 'commit=...' from version string if exists
  const indexCommit = version!.indexOf('commit');
  const versionString = version?.slice(0, indexCommit === -1 ? version!.length : indexCommit);

  const balance = appCtx.unit === 'BTC' ? (channelBalance || 0) / 100_000_000 : channelBalance!;

  const channelTotal = channelActive! + channelInactive! + channelPending!;

  return (
    <div className='h-full p-5'>
      <div className='bd-card'>
        <h2 className='font-bold text-lg'>{t('home.lightning')}</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.version')}</h6>
            <p>{versionString}</p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.status')}</h6>
            <p>{status}</p>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.channel')}</h6>
            <p>{`${channelActive} / ${channelTotal}`}</p>
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
  version: string | undefined;
  status: string | undefined;
  channelActive: number | undefined;
  channelInactive: number | undefined;
  channelPending: number | undefined;
  channelBalance: number | undefined;
}
