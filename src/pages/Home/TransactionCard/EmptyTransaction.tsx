import { FC } from "react";

export const SingleTransaction: FC = () => {
  return (
    <li className="flex h-24 flex-col justify-center px-0 py-2 text-center md:px-4">
      <div className="flex w-full items-center justify-center">
        <div className="w-2/12"></div>
        <time className="w-5/12 text-sm"></time>
        <p className={`inline-block w-8/12`}></p>
      </div>
      <div className="w-full overflow-hidden overflow-ellipsis whitespace-nowrap text-center italic"></div>
      <div className="mx-auto h-1 w-full pt-4">
        <div className="" />
      </div>
    </li>
  );
};

export default SingleTransaction;
