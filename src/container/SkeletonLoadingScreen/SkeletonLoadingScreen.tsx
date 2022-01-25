import { FC } from "react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";

const SkeletonLoadingScreen: FC = () => {
  return (
    <>
      <header className="fixed top-0 z-10 mx-auto flex h-16 w-full items-center justify-between border-b border-gray-300 bg-white px-8 shadow-md transition-colors dark:bg-gray-800 dark:text-gray-300"></header>
      <nav className="content-container fixed mb-16 hidden w-full flex-col justify-between bg-white px-2 pt-8 shadow-lg transition-colors dark:bg-gray-800 md:flex md:w-2/12"></nav>
      <main className="content-container page-container flex items-center justify-center bg-gray-100 dark:bg-gray-700">
        <LoadingSpinner color="text-yellow-500" />
      </main>
    </>
  );
};

export default SkeletonLoadingScreen;
