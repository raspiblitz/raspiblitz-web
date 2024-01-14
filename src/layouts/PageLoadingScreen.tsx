import { FC } from "react";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

// Loading Screen where sidebar is visible and usable
const PageLoadingScreen: FC = () => {
  return (
    <main
      className={`content-container page-container bg-gray-100 p-5 transition-colors dark:bg-gray-700 dark:text-white lg:pb-8 lg:pr-8 lg:pt-8`}
    >
      <section className="content-container flex items-center justify-center">
        <LoadingSpinner color="text-yellow-500" />
      </section>
    </main>
  );
};

export default PageLoadingScreen;
