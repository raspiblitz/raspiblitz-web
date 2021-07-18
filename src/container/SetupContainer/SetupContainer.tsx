import { FC } from 'react';

const SetupContainer: FC = (props) => {
  return (
    <main className='h-screen w-screen content-container dark:text-white transition-colors flex flex-col flex-wrap justify-center items-center'>
      <div className='lg:w-2/3 bg-white border border-gray-300 shadow-lg rounded p-4'>{props.children}</div>
    </main>
  );
};

export default SetupContainer;
