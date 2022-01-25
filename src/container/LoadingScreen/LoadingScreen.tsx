import { FC, useContext } from "react";
import LoadingSpinner from "../../components/Shared/LoadingSpinner/LoadingSpinner";
import { AppContext } from "../../store/app-context";
import { ReactComponent as RaspiBlitzLogo } from "../../assets/RaspiBlitz_Logo_Main.svg";
import { ReactComponent as RaspiBlitzLogoDark } from "../../assets/RaspiBlitz_Logo_Main_Negative.svg";

const LoadingScreen: FC = () => {
  const appCtx = useContext(AppContext);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
      {!appCtx.darkMode && <RaspiBlitzLogo className="mb-5 h-12" />}
      {appCtx.darkMode && <RaspiBlitzLogoDark className="mb-5 h-12" />}
      <LoadingSpinner color="text-yellow-500" />
    </div>
  );
};

export default LoadingScreen;
