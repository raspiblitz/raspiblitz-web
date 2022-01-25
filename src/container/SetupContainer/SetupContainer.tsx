import { FC } from "react";

const SetupContainer: FC = (props) => {
  return (
    <main className="content-container flex h-screen w-screen flex-col flex-wrap items-center justify-center transition-colors dark:text-white">
      <div className="rounded border border-gray-300 bg-white p-4 shadow-lg lg:w-2/3">
        {props.children}
      </div>
    </main>
  );
};

export default SetupContainer;
