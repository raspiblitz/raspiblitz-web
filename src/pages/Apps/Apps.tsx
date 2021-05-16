import DashboardBox from '../../container/DashboardBox/DashboardBox';

export const Apps = () => {
  return (
    <div className='content-container w-full dark:text-white transition-colors'>
      <div className='h-full grid gap-4 grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-2 xl:grid-cols-2 xl:grid-rows-3'>
        <DashboardBox addText='' logo={<div></div>} name='Installed' />
        <DashboardBox addText='' logo={<div></div>} name='Available Apps' />
      </div>
    </div>
  );
};

export default Apps;
