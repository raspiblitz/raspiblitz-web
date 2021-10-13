import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ChainIcon } from '../../../assets/chain.svg';
import { ReactComponent as LightningIcon } from '../../../assets/lightning.svg';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';
import { AppContext } from '../../../store/app-context';
import { checkPropsUndefined } from '../../../util/util';
import LoadingBox from '../../Shared/LoadingBox/LoadingBox';

export const WalletCard: FC<WalletCardProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);

  if (checkPropsUndefined(props)) {
    return <LoadingBox />;
  }

  const { onchainBalance, lnBalance } = props;

  const convertedOnchainBalance = appCtx.unit === 'BTC' ? onchainBalance / 100_000_000 : onchainBalance;
  const convertedLnBalance = appCtx.unit === 'BTC' ? lnBalance / 100_000_000 : lnBalance;

  const totalBalance =
    appCtx.unit === 'BTC'
      ? +(convertedOnchainBalance + convertedLnBalance).toFixed(8)
      : convertedOnchainBalance + convertedLnBalance;

  return (
    <div className='p-5 h-full'>
      <div className='bd-card h-full transition-colors'>
        <section className='text-black flex flex-col lg:flex-row flex-wrap p-5'>
          <div className='bg-gradient-to-b from-yellow-500 bg-yellow-600 w-full text-white rounded-xl p-4'>
            <article className='w-full flex flex-col'>
              <h6 className='text-xl'>{t('wallet.balance')}</h6>
              <p className='text-2xl font-bold'>
                {totalBalance.toLocaleString()} {appCtx.unit}
              </p>
            </article>
            <article className='w-full flex flex-col'>
              <h6>
                <ChainIcon className='inline h-5 w-5' />
                &nbsp;{t('wallet.on_chain')}
              </h6>
              <p className='text-lg font-bold'>
                {convertedOnchainBalance.toLocaleString()} {appCtx.unit}
              </p>
            </article>
            <article className='w-full flex flex-col'>
              <h6>
                <LightningIcon className='inline h-5 w-5' />
                &nbsp;{t('home.lightning')}
              </h6>
              <p className='text-lg font-bold'>
                {convertedLnBalance.toLocaleString()} {appCtx.unit}
              </p>
            </article>
          </div>
        </section>
        <section className='flex justify-around p-2'>
          <button
            onClick={props.onReceive}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-3 rounded flex justify-center items-center'
          >
            <ReceiveIcon className='h-6 w-6' />
            <span>&nbsp;{t('wallet.receive')}</span>
          </button>
          <button
            onClick={props.onSend}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-3 rounded flex justify-center items-center'
          >
            <SendIcon className='h-6 w-6' />
            <span>&nbsp;{t('wallet.send')}</span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default WalletCard;

export interface WalletCardProps {
  onchainBalance: number;
  lnBalance: number;
  onReceive: () => void;
  onSend: () => void;
}
