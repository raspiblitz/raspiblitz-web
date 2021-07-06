import { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ReactComponent as ChainIcon } from '../../../assets/chain.svg';
import { ReactComponent as LightningIcon } from '../../../assets/lightning.svg';
import { ReactComponent as ReceiveIcon } from '../../../assets/receive.svg';
import { ReactComponent as SendIcon } from '../../../assets/send.svg';
import { AppContext } from '../../../store/app-context';

export const WalletCard: FC<WalletCardProps> = (props) => {
  const { t } = useTranslation();
  const appCtx = useContext(AppContext);

  const onchainBalance = appCtx.unit === 'BTC' ? props.onchainBalance : props.onchainBalance * 100_000_000;
  const lnBalance = appCtx.unit === 'BTC' ? props.lnBalance : props.lnBalance * 100_000_000;

  const totalBalance = appCtx.unit === 'BTC' ? +(onchainBalance + lnBalance).toFixed(8) : onchainBalance + lnBalance;

  return (
    <div className='p-5 h-full'>
      <div className='bd-card h-full transition-colors'>
        <div className='text-black flex flex-col lg:flex-row flex-wrap p-5'>
          <div className='bg-yellow-300 w-full rounded-xl p-4'>
            <div className='w-full flex flex-col'>
              <span className='text-xl'>{t('wallet.balance')}</span>
              <span className='text-2xl font-bold'>
                {totalBalance.toLocaleString()} {appCtx.unit}
              </span>
            </div>
            <div className='w-full flex flex-col'>
              <span>
                <ChainIcon className='inline h-5 w-5' />
                &nbsp;{t('wallet.on_chain')}
              </span>
              <span className='text-lg font-bold'>
                {onchainBalance.toLocaleString()} {appCtx.unit}
              </span>
            </div>
            <div className='w-full flex flex-col'>
              <span>
                <LightningIcon className='inline h-5 w-5' />
                &nbsp;{t('home.lightning')}
              </span>
              <span className='text-lg font-bold'>
                {lnBalance.toLocaleString()} {appCtx.unit}
              </span>
            </div>
          </div>
        </div>
        <div className='flex justify-around p-2'>
          <button
            onClick={props.onReceive}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-4 rounded flex justify-center items-center'
          >
            <ReceiveIcon className='h-6 w-6' />
            <span>&nbsp;{t('wallet.receive')}</span>
          </button>
          <button
            onClick={props.onSend}
            className='h-10 w-5/12 bg-black hover:bg-gray-700 text-white p-4 rounded flex justify-center items-center'
          >
            <SendIcon className='h-6 w-6' />
            <span>&nbsp;{t('wallet.send')}</span>
          </button>
        </div>
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
