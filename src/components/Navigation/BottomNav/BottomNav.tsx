import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactComponent as AppIcon } from "../../../assets/apps.svg";
import { ReactComponent as HomeLogo } from "../../../assets/home.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/settings.svg";

const navLinkClasses = "dark:text-white opacity-80";
const navLinkActiveClasses = "text-yellow-500 dark:text-yellow-500 opacity-100";
const createClassName = ({ isActive }: { isActive: boolean }) =>
  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ""}`;
const navIconClasses = "w-8 h-8 mx-auto";
const navLabelClasses = "text-center mx-1";

const BottomNav: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="md:hidden z-10 flex flex-wrap items-center justify-evenly h-16 w-full shadow-inner fixed bottom-0 border-t-2 bg-white dark:bg-gray-800 transition-colors">
      <NavLink to="/home" className={(props) => createClassName(props)}>
        <HomeLogo className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.home")}</span>
      </NavLink>
      <NavLink to="/apps" className={(props) => createClassName(props)}>
        <AppIcon className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.apps")}</span>
      </NavLink>
      <NavLink to="/settings" className={(props) => createClassName(props)}>
        <SettingsIcon className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.settings")}</span>
      </NavLink>
    </footer>
  );
};

export default BottomNav;
