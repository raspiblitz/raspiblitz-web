import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { checkPropsUndefined } from '../../../util/util';
import LoadingBox from '../../Shared/LoadingBox/LoadingBox';

export const BitcoinCard: FC<BitcoinCardProps> = (props) => {
  const { t } = useTranslation();

  if (checkPropsUndefined(props)) {
    return <LoadingBox />;
  }

  const { blocks, headers, version, network, progress, peers } = props;

  const syncPercentage = (progress * 100).toFixed(2);

  const shownVersion = version.replace(/\//g, '').split(':')[1];

  return (
    <div className='p-5 h-full'>
      <section className='bd-card'>
        <h2 className='font-bold text-lg'>{t('home.bitcoin')}</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.version')}</h6>
            <p>{shownVersion}</p>
          </div>
          <div className="w-1/2">
            <h6 className="text-sm text-gray-500 dark:text-gray-200">
              {t("home.network")}
            </h6>
            <p>{network}</p>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.peers')}</h6>
            <p>{peers}</p>
          </div>
          <div className='w-1/2'>
            <h6 className='text-sm text-gray-500 dark:text-gray-200'>{t('home.blocks_synced')}</h6>
            <p>
              {`${blocks} / ${headers}`} <span className='inline-block'>({syncPercentage} %)</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BitcoinCard;

export interface BitcoinCardProps {
  version: string;
  network: string;
  blocks: number;
  headers: number;
  progress: number;
  peers: number;
}
