import { FC, useEffect, useState } from 'react';
import { ReactComponent as InfoIcon } from '../../../assets/info.svg';
import { ReactComponent as LinkIcon } from '../../../assets/link.svg';
import { ReactComponent as PlusIcon } from '../../../assets/plus.svg';

export const AppInstallCard: FC<AppInstallCardProps> = (props) => {
  const [image, setImage] = useState('');

  const { id } = props;

  useEffect(() => {
    import(`../../../assets/apps/${id}.png`)
      .then((image) => {
        setImage(image.default);
      })
      .catch((e) => {
        // use fallback icon if image for id doesn't exist
        import('../../../assets/cloud.svg').then((img) => setImage(img.default));
      });
  }, [id]);

  return (
    <div className='bd-card'>
      <div className='h-4/6 flex flex-row mt-2 items-center w-full'>
        {/* Icon */}
        <div className='w-1/4 flex justify-center items-center p-2'>
          <img className='max-h-16' src={image} alt={`${props.id} Logo`} />
        </div>
        {/* Content */}
        <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl'>
          <div>{props.name}</div>
          <div className='text-gray-500 text-base overflow-ellipsis dark:text-gray-400'>{props.description}</div>
        </div>
      </div>
      <div className='h-2/6 py-2 flex flex-row gap-2'>
        <button className='w-1/2 border border-black flex justify-center items-center p-2 hover:bg-gray-300'>
          <InfoIcon />
          &nbsp; Info
        </button>
        {props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center p-2 text-gray-700 bg-yellow-400 hover:bg-yellow-300'>
            <LinkIcon />
            &nbsp;Open
          </button>
        )}
        {!props.installed && (
          <button className='w-1/2 border border-black flex justify-center items-center p-2 text-gray-700 bg-yellow-400 hover:bg-yellow-300'>
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
