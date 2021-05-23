import { FC, useEffect, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../../assets/info.svg';
import { ReactComponent as LinkIcon } from '../../../assets/link.svg';
import { ReactComponent as PlusIcon } from '../../../assets/plus.svg';

export const AppInstallCard: FC<AppInstallCardProps> = (props) => {
  const [image, setImage] = useState('');

  const { id } = props;

  useEffect(() => {
    import(`../../../assets/apps/${id}.png`).then((image) => {
      setImage(image.default);
    });
  }, [id]);

  return (
    <div className='border border-black box-border rounded-md bg-white justify-center px-6 py-4 text-black dark:bg-gray-800 dark:text-white'>
      <div className='flex flex-row my-2 items-center w-full'>
        {/* Icon */}
        <div className='w-1/4 flex justify-center items-center p-2'>
          <img height='60px' src={image} alt={`${props.id} Logo`} />
        </div>
        {/* Content */}
        <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl overflow-hidden'>
          <div>{props.name}</div>
          <div className='text-gray-500 text-base overflow-ellipsis dark:text-gray-400'>{props.description}</div>
        </div>
      </div>
      <div className='flex flex-row gap-2'>
        <button className='w-1/2 border border-black flex justify-center items-center p-2 hover:bg-gray-300'>
          <InfoIcon />
          &nbsp; Info
        </button>
        {props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center text-white p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400'>
            <LinkIcon />
            &nbsp;Open
          </button>
        )}
        {!props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center p-2 text-black bg-yellow-400 hover:bg-yellow-300'>
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
  id: string;
  name: string;
  description: string;
  installed: boolean;
  onInstall: (id: string) => void;
}
