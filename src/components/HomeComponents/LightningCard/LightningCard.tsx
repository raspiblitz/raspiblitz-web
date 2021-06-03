import { FC, useContext } from 'react';
import { AppContext } from '../../../store/app-context';

export const LightningCard: FC<LightningCardProps> = (props) => {
  const appCtx = useContext(AppContext);

  const balance = appCtx.unit === 'BTC' ? props.channelBalance : props.channelBalance * 100_000_000;

  return (
    <div className='p-5 h-full'>
      <div className='bd-card'>
        <h2 className='font-bold text-lg'>Lightning</h2>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Version</h4>
            <div>{props.version}</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Status</h4>
            <div>{props.status}</div>
          </div>
        </div>
        <div className='flex overflow-hidden py-4'>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Channels</h4>
            <div>{`${props.channelOnline} / ${props.channelTotal}`}</div>
          </div>
          <div className='w-1/2'>
            <h4 className='text-sm text-gray-500'>Channcel Balance</h4>
            <div>
              {balance.toLocaleString()} {appCtx.unit}
            </div>
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
