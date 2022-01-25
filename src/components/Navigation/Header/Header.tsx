import { FC, useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../../assets/menu.svg";
import { ReactComponent as RaspiBlitzMobileLogo } from "../../../assets/RaspiBlitz_Logo_Icon.svg";
import { ReactComponent as RaspiBlitzLogo } from "../../../assets/RaspiBlitz_Logo_Main.svg";
import { ReactComponent as RaspiBlitzLogoDark } from "../../../assets/RaspiBlitz_Logo_Main_Negative.svg";
import useSSE from "../../../hooks/use-sse";
import { AppContext } from "../../../store/app-context";
import DropdownMenu from "./DropdownMenu/DropdownMenu";

const Header: FC = () => {
  const { darkMode } = useContext(AppContext);
  const { systemInfo } = useSSE();
  const dropdown = useRef<HTMLDivElement>(null);
  const menu = useRef<SVGSVGElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => {
      document.removeEventListener("mousedown", clickOutsideHandler);
    };
  }, [dropdown]);

  const showDropdownHandler = () => {
    setShowDropdown((prev) => !prev);
  };

  const clickOutsideHandler = (event: MouseEvent) => {
    if (
      menu.current &&
      dropdown.current &&
      !dropdown.current.contains(event.target as Node) &&
      !menu.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  return (
    <header className="fixed top-0 z-10 mx-auto flex h-16 w-full items-center justify-between border-b border-gray-300 bg-white px-8 shadow-md transition-colors dark:bg-gray-800 dark:text-gray-300">
      <NavLink to="/">
        <RaspiBlitzMobileLogo className="h-8 w-8 text-black dark:text-white md:hidden" />
        {!darkMode && <RaspiBlitzLogo className="hidden h-8 md:block" />}
        {darkMode && <RaspiBlitzLogoDark className="hidden h-8 md:block" />}
      </NavLink>
      <div className="text-xl font-bold">{systemInfo.alias}</div>
      <div className="relative">
        <MenuIcon
          ref={menu}
          onClick={showDropdownHandler}
          className="h-8 w-8"
        />
        {showDropdown && <DropdownMenu ref={dropdown} />}
      </div>
    </header>
  );
};

export default Header;
