import type { FC } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import SideDrawer from "./SideDrawer";

type Props = {
  children?: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <Header />
      <SideDrawer />
      {children}
      <BottomNav />
    </>
  );
};

export default Layout;
