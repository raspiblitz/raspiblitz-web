import useSSE from "@/hooks/use-sse";
import type { FC, PropsWithChildren } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import SideDrawer from "./SideDrawer";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  // use SSE for all components after login
  useSSE();
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
