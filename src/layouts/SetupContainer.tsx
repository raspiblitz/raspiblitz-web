import I18nDropdown from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import { MoonIcon } from "@heroicons/react/24/outline";
import { FC, PropsWithChildren, useContext } from "react";

const SetupContainer: FC<PropsWithChildren> = ({ children }) => {
  const { toggleDarkMode } = useContext(AppContext);
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 transition-colors dark:bg-gray-700">
      <MoonIcon
        className="text-dark fixed right-4 top-4 h-8 dark:text-yellow-500"
        onClick={toggleDarkMode}
      />
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nDropdown />
      </div>
      <div className="min-h-[66%] w-4/5">
        <div className="bd-card">{children}</div>
      </div>
    </main>
  );
};

export default SetupContainer;
