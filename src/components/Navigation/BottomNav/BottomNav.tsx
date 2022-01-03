import { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { ReactComponent as AppIcon } from "../../../assets/apps.svg";
import { ReactComponent as HomeLogo } from "../../../assets/home.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/settings.svg";

const BottomNav: FC = () => {
  const { t } = useTranslation();
  const navLinkClasses = "dark:text-white opacity-80";
  const navLinkActiveClasses =
    "text-yellow-500 dark:text-yellow-500 opacity-100";
  const iconClasses = "w-8 h-8 mx-auto";
  const divClasses = "text-center mx-1";

  return (
    <footer className="md:hidden z-10 flex flex-wrap items-center justify-evenly h-16 w-full shadow-inner fixed bottom-0 border-t-2 bg-white dark:bg-gray-800 transition-colors">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          navLinkClasses + (isActive ? navLinkActiveClasses : "")
        }
      >
        <HomeLogo className={iconClasses} />
        <div className={divClasses}>{t("navigation.home")}</div>
      </NavLink>
      <NavLink
        to="apps"
        className={({ isActive }) =>
          navLinkClasses + (isActive ? navLinkActiveClasses : "")
        }
      >
        <AppIcon className={iconClasses} />
        <div className={divClasses}>{t("navigation.apps")}</div>
      </NavLink>
      <NavLink
        to="settings"
        className={({ isActive }) =>
          navLinkClasses + (isActive ? navLinkActiveClasses : "")
        }
      >
        <SettingsIcon className={iconClasses} />
        <div className={divClasses}>{t("navigation.settings")}</div>
      </NavLink>
    </footer>
  );
};

export default BottomNav;
