import {
  Cog6ToothIcon,
  HomeIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";

const navLinkClasses = "text-white opacity-80";
const navLinkActiveClasses = "text-yellow-500 opacity-100";
const createClassName = ({ isActive }: { isActive: boolean }) =>
  `${navLinkClasses} ${isActive ? navLinkActiveClasses : ""}`;
const navIconClasses = "w-8 h-8 mx-auto";
const navLabelClasses = "text-center mx-1";

const BottomNav: FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="fixed bottom-0 z-10 flex h-16 w-full flex-wrap items-center justify-evenly border-t-2 bg-gray-800 shadow-inner transition-colors lg:hidden">
      <NavLink to="/home" className={(props) => createClassName(props)}>
        <HomeIcon className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.home")}</span>
      </NavLink>
      <NavLink to="/apps" className={(props) => createClassName(props)}>
        <Squares2X2Icon className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.apps")}</span>
      </NavLink>
      <NavLink to="/settings" className={(props) => createClassName(props)}>
        <Cog6ToothIcon className={navIconClasses} />
        <span className={navLabelClasses}>{t("navigation.settings")}</span>
      </NavLink>
    </footer>
  );
};

export default BottomNav;
