import { forwardRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LogoutIcon } from "../assets/logout.svg";
import { AppContext, Unit } from "../context/app-context";
import Toggle from "../components/Toggle";

const DropdownMenu = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const { unit, darkMode, logout, toggleDarkMode, toggleUnit } =
    useContext(AppContext);
  const unitActive = unit === Unit.SAT;

  const logoutHandler = () => {
    logout();
  };

  return (
    <div
      ref={ref}
      className="absolute top-14 right-5 z-10 flex w-56 rounded-lg border border-black bg-white dark:border-gray-300 dark:bg-gray-800"
    >
      <div className="flex w-full flex-col items-center justify-center text-center">
        <div className="w-full py-4">
          <Toggle
            toggleText={t("navigation.display_sats")}
            active={unitActive}
            toggleFn={toggleUnit}
          />
        </div>
        <div className="w-full py-4">
          <Toggle
            toggleText={t("navigation.dark_mode")}
            active={darkMode}
            toggleFn={toggleDarkMode}
          />
        </div>
        <button className="bd-button mt-3 w-full py-2" onClick={logoutHandler}>
          <LogoutIcon className="inline-block h-5 w-5" /> &nbsp;
          {t("navigation.logout")}
        </button>
      </div>
    </div>
  );
});

export default DropdownMenu;
