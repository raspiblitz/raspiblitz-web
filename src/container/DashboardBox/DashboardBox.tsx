const DashboardBox = (props: Partial<DashboardBoxProps>) => {
  return (
    <>
      <div className='h-full w-full dark:text-white transition-colors'>
        <div className='bg-white dark:bg-gray-800 pt-5 mx-5 my-3 rounded-xl shadow-md'>
          {/* Header */}
          <div className='font-bold flex px-5'>
            <div className='w-2/3'>
              <div>{props.name}</div>
              <div className='text-gray-400'>{props.addText}</div>
            </div>
            <div className='w-1/3 h-full flex justify-end'>{props.logo}</div>
          </div>
          {/* Body */}
          <div>{props.children}</div>
        </div>
      </div>
    </>
  );
};

export default DashboardBox;

export interface DashboardBoxProps {
  name: string;
  addText: string;
  logo: JSX.Element;
  children: React.ReactNode;
}
