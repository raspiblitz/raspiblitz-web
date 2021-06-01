import { FC, useEffect, useState } from 'react';

export const AppStatusCard: FC<AppStatusCardProps> = (props) => {
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

  const statusColor = props.status === 'online' ? 'text-green-400' : 'text-red-500';
  return (
    <div className='p-5 h-auto'>
      <div className='bd-card'>
        <div className='flex flex-row my-2 items-center w-full'>
          {/* Icon */}
          <div className='w-1/4 max-h-16 flex justify-center items-center p-2'>
            <img className='max-h-16' src={image} alt='logo' />
          </div>
          {/* Content */}
          <div className='w-3/4 pl-5 justify-center items-start flex flex-col text-xl'>
            <div className='dark:text-white'>{props.name}</div>
            <div className={`pt-3 ${statusColor}`}>{props.status}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppStatusCard;

export interface AppStatusCardProps {
  id: string;
  name: string;
  status: string;
}
