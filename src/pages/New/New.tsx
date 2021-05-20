import { FC } from 'react';
import { ReactComponent as SomeIcon } from '../../assets/home.svg';
import AppCard from '../../components/BDesign/AppCard/AppCard';

const New: FC = () => {
  const icon = <SomeIcon />;
  return (
    <div className='content-container flex flex-col w-full dark:text-white'>
      <div className='w-full md:w-1/3 p-5'>
        <AppCard name='mempool.space' description='Blockchain Explorer' status='Online' icon={icon} />
      </div>
    </div>
  );
};

export default New;
