import {
  CogIcon,
  HomeIcon,
  LogoutIcon,
  ViewGridIcon,
} from "@heroicons/react/outline";
import type { FC } from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/app-context";

const navLinkClasses =
  "flex md:flex-col lg:flex-row items-center justify-center py-4 mx-auto w-full dark:text-white opacity-80";
const navLinkActiveClasses = "text-yellow-500 dark:text-yellow-500 opacity-100";
const createClassName = ({ isActive }: { isActive: boolean }) =>
  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ""}`;
const navIconClasses = "inline w-10 h-10";

export const SideDrawer: FC = () => {
  const { logout } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <nav className="content-container fixed mb-16 hidden w-full flex-col justify-between bg-white px-2 pt-8 shadow-md transition-colors dark:bg-gray-800 lg:flex lg:w-64">
      <div className="flex flex-col items-center justify-center">
        <NavLink to="/home" className={(props) => createClassName(props)}>
          <HomeIcon className={navIconClasses} />
          <span className="mx-3 flex w-1/2 justify-center text-lg lg:block">
            {t("navigation.home")}
          </span>
        </NavLink>
        <NavLink to="/apps" className={(props) => createClassName(props)}>
          <ViewGridIcon className={navIconClasses} />
          <span className="mx-3 flex w-1/2 justify-center text-lg lg:block">
            {t("navigation.apps")}
          </span>
        </NavLink>
        <NavLink to="/settings" className={(props) => createClassName(props)}>
          <CogIcon className={navIconClasses} />
          <span className="mx-3 flex w-1/2 justify-center text-lg lg:block">
            {t("navigation.settings")}
          </span>
        </NavLink>
      </div>

      <button onClick={logout} className="bd-button mb-3 h-8 w-full">
        <LogoutIcon className="inline-block h-5 w-5" />
        &nbsp;
        {t("navigation.logout")}
      </button>
    </nav>
  );
};

export default SideDrawer;
