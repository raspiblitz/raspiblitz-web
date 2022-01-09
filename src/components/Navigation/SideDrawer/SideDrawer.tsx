import { useContext } from "react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactComponent as AppIcon } from "../../../assets/apps.svg";
import { ReactComponent as HomeLogo } from "../../../assets/home.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/logout.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/settings.svg";
import { AppContext } from "../../../store/app-context";

const navLinkClasses =
  "flex md:flex-col lg:flex-row items-center justify-center py-4 xl:pl-6 mx-auto w-full dark:text-white opacity-80";
const navLinkActiveClasses = "text-yellow-500 dark:text-yellow-500 opacity-100";
const createClassName = ({ isActive }: { isActive: boolean }) =>
  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ""}`;
const navIconClasses = "inline-block w-10 h-10";

export const SideDrawer: FC = () => {
  const appCtx = useContext(AppContext);
  const { t } = useTranslation();

  const logoutHandler = () => {
    appCtx.logout();
  };

  return (
    <nav className="hidden md:flex flex-col justify-between content-container w-full md:w-2/12 fixed px-2 pt-8 mb-16 shadow-lg bg-white dark:bg-gray-800 transition-colors">
      <div>
        <NavLink to="/home" className={(props) => createClassName(props)}>
          <HomeLogo className={navIconClasses} />
          <span className="w-1/2 mx-3 flex justify-center lg:block text-lg">
            {t("navigation.home")}
          </span>
        </NavLink>
        <NavLink to="/apps" className={(props) => createClassName(props)}>
          <AppIcon className={navIconClasses} />
          <span className="w-full lg:w-1/2 mx-3 flex justify-center lg:block text-lg">
            {t("navigation.apps")}
          </span>
        </NavLink>
        <NavLink to="/settings" className={(props) => createClassName(props)}>
          <SettingsIcon className={navIconClasses} />
          <span className="w-1/2 mx-3 flex justify-center lg:block text-lg">
            {t("navigation.settings")}
          </span>
        </NavLink>
      </div>

      <button onClick={logoutHandler} className="bd-button w-full h-8 mb-3">
        <LogoutIcon className="inline-block w-5 h-5" />
        &nbsp;
        {t("navigation.logout")}
      </button>
    </nav>
  );
};

export default SideDrawer;
