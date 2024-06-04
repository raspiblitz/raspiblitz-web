import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupStatus } from "@/models/setup.model";
import { Spinner } from "@nextui-org/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";

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
      headline = `${t("setup.pleasewait")}...`;
      break;
    case SetupStatus.SHUTDOWN:
      headline = `${t("setup.shuttingdown")}...`;
      break;
    case SetupStatus.REBOOT:
      headline = `${t("setup.restarting")}...`;
      details = `(${t("setup.restartinfo")})`;
      break;
    case SetupStatus.WAITPROVISION:
      headline = `${t("setup.preparingsetup")}...`;
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
        <Spinner size="lg" />

        <Headline>{headline}</Headline>

        <p className="my-2 text-sm">{details}</p>
      </section>
    </SetupContainer>
  );
};

export default WaitScreen;
