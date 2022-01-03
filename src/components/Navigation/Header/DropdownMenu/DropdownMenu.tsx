import { forwardRef, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ReactComponent as LogoutIcon } from "../../../../assets/logout.svg";
import { AppContext } from "../../../../store/app-context";
import Toggle from "../../../Shared/Toggle/Toggle";

const DropdownMenu = forwardRef<HTMLDivElement>((_, ref) => {
  const { t } = useTranslation();
  const { unit, darkMode, logout, toggleDarkMode, toggleUnit } =
    useContext(AppContext);
  const unitActive = unit === "Sat";

  const logoutHandler = () => {
    logout();
  };

  return (
    <div
      ref={ref}
      className="flex absolute right-0 border border-black rounded-lg w-56 z-10 bg-white dark:bg-gray-800 dark:border-gray-300"
    >
      <div className="flex w-full text-center justify-center flex-col items-center">
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
        <button className="bd-button w-full py-2 mt-3" onClick={logoutHandler}>
          <LogoutIcon className="inline-block w-5 h-5" /> &nbsp;
          {t("navigation.logout")}
        </button>
      </div>
    </div>
  );
});

export default DropdownMenu;
