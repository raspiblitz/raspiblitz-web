import BottomNav from "./BottomNav";
import Header from "./Header";
import SideDrawer from "./SideDrawer";
import useWs from "@/hooks/use-ws";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  // use SSE for all components after login
  useWs();
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
