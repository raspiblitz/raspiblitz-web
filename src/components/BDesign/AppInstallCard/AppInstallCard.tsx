import { FC } from 'react';

import { ReactComponent as SomeIcon } from '../../../assets/home.svg';
import { ReactComponent as InfoIcon } from '../../../assets/info.svg';
import { ReactComponent as PlusIcon } from '../../../assets/plus.svg';
import { ReactComponent as LinkIcon } from '../../../assets/link.svg';

export const AppInstallCard: FC<AppInstallCardProps> = (props) => {
  return (
    <div className='border border-black box-border rounded-md bg-white justify-center px-6 py-4 text-black'>
      <div className='flex flex-row my-2 items-center w-full'>
        {/* Icon */}
        <div className='w-1/4 flex justify-center items-center'>
          <SomeIcon />
        </div>
        {/* Content */}
        <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl overflow-hidden'>
          <div>{props.name}</div>
          <div className='text-gray-500 text-base overflow-ellipsis'>{props.description}</div>
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        <button className='w-1/2 border border-black flex justify-center items-center p-2'>
          <InfoIcon />
          &nbsp; Info
        </button>
        {props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center p-2'>
            <LinkIcon />
            &nbsp;Open
          </button>
        )}
        {!props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center p-2'>
            <PlusIcon />
            &nbsp;Install
          </button>
        )}
      </div>
    </div>
  );
};

export default AppInstallCard;

export interface AppInstallCardProps {
  name: string;
  description: string;
  installed: boolean;
  onInstall: () => void;
}
