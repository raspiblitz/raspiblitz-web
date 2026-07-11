import type { FC, PropsWithChildren } from "react";
import useRealtime from "@/hooks/use-realtime";
import BottomNav from "./BottomNav";
import Header from "./Header";
import SideDrawer from "./SideDrawer";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  // use SSE for all components after login
  useRealtime();
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
