import useSSE from "@/hooks/use-sse";
import type { FC } from "react";
import BottomNav from "./BottomNav";
import Header from "./Header";
import SideDrawer from "./SideDrawer";

type Props = {
  children?: React.ReactNode;
};

const Layout: FC<Props> = ({ children }) => {
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
