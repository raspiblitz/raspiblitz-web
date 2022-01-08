import { FC } from "react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";

const SkeletonLoadingScreen: FC = () => {
  return (
    <>
      <header className="fixed top-0 z-10 flex items-center justify-between border-b border-gray-300 h-16 mx-auto px-8 w-full shadow-md bg-white dark:bg-gray-800 dark:text-gray-300 transition-colors"></header>
      <nav className="hidden md:flex flex-col justify-between content-container w-full md:w-2/12 fixed px-2 pt-8 mb-16 shadow-lg bg-white dark:bg-gray-800 transition-colors"></nav>
      <main className="content-container page-container bg-gray-100 dark:bg-gray-700 flex justify-center items-center">
        <LoadingSpinner color="text-yellow-500" />
      </main>
    </>
  );
};

export default SkeletonLoadingScreen;
