import { FC, useContext } from "react";
import { ReactComponent as MoonLogo } from "../../assets/moon.svg";
import I18nDropdown from "../../components/Shared/I18nDropdown/I18nDropdown";
import { AppContext } from "../../store/app-context";

type Props = {
  children?: React.ReactNode;
};

const SetupContainer: FC<Props> = ({ children }) => {
  const { toggleDarkMode } = useContext(AppContext);
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 transition-colors dark:bg-gray-700">
      <MoonLogo
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
