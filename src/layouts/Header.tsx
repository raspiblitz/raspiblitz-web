import DropdownMenu from "./DropdownMenu";
import RaspiBlitzMobileLogo from "@/assets/RaspiBlitz_Logo_Icon.svg?react";
import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import { SSEContext } from "@/context/sse-context";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { systemInfo } = useContext(SSEContext);
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
    <header className="fixed top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b border-gray-300 bg-gray-800 px-8 text-gray-300 shadow-md transition-colors">
      <NavLink to="/">
        <RaspiBlitzMobileLogo className="h-8 w-8 text-white md:hidden" />
        <RaspiBlitzLogoDark className="hidden h-8 md:block" />
      </NavLink>
      <div className="text-xl font-bold">{systemInfo.alias}</div>
      <div className="flex items-center">
        <Bars3Icon
          ref={menu}
          onClick={showDropdownHandler}
          className="h-8 w-8 cursor-pointer hover:text-yellow-400"
        />
        {showDropdown && <DropdownMenu ref={dropdown} />}
      </div>
    </header>
  );
}
