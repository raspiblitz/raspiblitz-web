const DashboardBox = (props: any) => {
  return (
    <div className='content-container h-full w-full bg-gray-300 dark:bg-gray-600 dark:text-white transition-colors'>
      <div className='bg-white dark:bg-gray-800 pt-5 m-10 rounded-xl'>{props.children}</div>
    </div>
  );
};

export default DashboardBox;
