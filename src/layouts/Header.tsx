import RaspiBlitzMobileLogo from "@/assets/RaspiBlitz_Logo_Icon.svg?react";
import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import { AppContext, Unit } from "@/context/app-context";
import { SSEContext } from "@/context/sse-context";
import {
  SatoshiV1Icon,
  BitcoinCircleIcon,
} from "@bitcoin-design/bitcoin-icons-react/filled";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { type Key, useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

export default function Header() {
  const { t } = useTranslation();
  const { systemInfo } = useContext(SSEContext);
  const { unit, logout, toggleUnit } = useContext(AppContext);

  const unitActive = unit === Unit.SAT;

  const handleDropDownAction = (key: Key) => {
    if (key === "logout") {
      logout();
    }

    if (key === "toggle_sats") {
      toggleUnit();
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
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Bars3Icon className="h-8 w-8 cursor-pointer hover:text-yellow-400" />
          </DropdownTrigger>

          <DropdownMenu
            aria-label="Header Actions"
            variant="flat"
            onAction={(key) => handleDropDownAction(key)}
          >
            <DropdownItem
              key="toggle_sats"
              startContent={
                unitActive ? (
                  <BitcoinCircleIcon className="inline h-4 w-4" />
                ) : (
                  <SatoshiV1Icon className="inline h-4 w-4" />
                )
              }
            >
              {unitActive
                ? t("navigation.display_btc")
                : t("navigation.display_sats")}
            </DropdownItem>

            {/* Adding the documentation redirecting */}
            <DropdownItem
              key="documentation"
              href="https://docs.raspiblitz.org/docs/intro"
              startContent={<BookOpenIcon className="h-5 w-5" />}
            >
              Documentation
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              startContent={
                <ArrowRightStartOnRectangleIcon className="inline h-4 w-4" />
              }
            >
              {t("navigation.logout")}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </header>
  );
}
