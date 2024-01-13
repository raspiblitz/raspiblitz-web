import { FC } from "react";
import { useTranslation } from "react-i18next";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupStatus } from "@/models/setup.model";
import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

export type Props = {
  status: SetupStatus;
  message: string;
};

const WaitScreen: FC<Props> = ({ status, message }) => {
  const { t } = useTranslation();

  // optimize for certain states like
  // setup.scripts/eventInfoWait.sh
  let headline = "";
  let details = "";
  switch (status) {
    case SetupStatus.WAIT:
      headline = `... ${t("setup.pleasewait")} ...`;
      break;
    case SetupStatus.SHUTDOWN:
      headline = `... ${t("setup.shuttingdown")} ...`;
      break;
    case SetupStatus.REBOOT:
      headline = `... ${t("setup.restarting")} ...`;
      details = `(${t("setup.restartinfo")})`;
      break;
    case SetupStatus.WAITPROVISION:
      headline = `... ${t("setup.preparingsetup")} ...`;
      details = `(${t("setup.setupwait")})`;
      break;
    case SetupStatus.PROVISION:
      headline = `${t("setup.runningsetup")}:`;
      details = message;
      break;
    default:
      headline = status;
      details = message;
  }

  return (
    <SetupContainer>
      <section className="flex flex-col items-center justify-center">
        <h2 className="my-2 font-bold">{headline}</h2>
        <p className="my-2 text-sm italic">{details}</p>
        <LoadingSpinner />
      </section>
    </SetupContainer>
  );
};

export default WaitScreen;
