import I18nSelect from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import { MoonIcon } from "@heroicons/react/24/outline";
import { FC, PropsWithChildren, useContext } from "react";

const SetupContainer: FC<PropsWithChildren> = ({ children }) => {
  const { toggleDarkMode } = useContext(AppContext);
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-primary-900 transition-colors">
      <MoonIcon
        className="fixed right-4 top-4 h-8 text-white"
        onClick={toggleDarkMode}
      />
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nSelect />
      </div>
      <div>{children}</div>
    </main>
  );
};

export default SetupContainer;
