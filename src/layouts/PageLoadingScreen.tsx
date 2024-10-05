import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import { FC } from "react";

// Loading Screen where sidebar is visible and usable
const PageLoadingScreen: FC = () => {
  return (
    <main
      className={`content-container page-container bg-gray-700 p-5 text-white transition-colors lg:pb-8 lg:pr-8 lg:pt-8`}
    >
      <section className="content-container flex items-center justify-center">
        <LoadingSpinner color="text-yellow-500" />
      </section>
    </main>
  );
};

export default PageLoadingScreen;
