import { FC } from "react";
import BottomNav from "../../components/Navigation/BottomNav/BottomNav";
import Header from "../../components/Navigation/Header/Header";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout: FC = (props) => {
  return (
    <>
      <Header />
      <SideDrawer />
      {props.children}
      <BottomNav />
    </>
  );
};

export default Layout;
