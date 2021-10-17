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
  const appCtx = useContext(AppContext);
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
    <header className="fixed top-0 z-10 flex items-center justify-between border-b border-gray-300 h-16 mx-auto px-8 w-full shadow-md bg-white dark:bg-gray-800 dark:text-gray-300 transition-colors">
      <NavLink to="/">
        <RaspiBlitzMobileLogo className="h-8 w-8 md:hidden text-black dark:text-white" />
        {!appCtx.darkMode && <RaspiBlitzLogo className="h-8 hidden md:block" />}
        {appCtx.darkMode && (
          <RaspiBlitzLogoDark className="h-8 hidden md:block" />
        )}
      </NavLink>
      <div className='font-bold text-xl'>{systemInfo.alias}</div>
      <div className='relative'>
        <MenuIcon ref={menu} onClick={showDropdownHandler} className='w-8 h-8' />
        {showDropdown && <DropdownMenu ref={dropdown} />}
      </div>
    </header>
  );
};

export default Header;
