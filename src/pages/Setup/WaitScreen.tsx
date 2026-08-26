import { Spinner } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { Headline } from "@/components/Headline";
import SetupContainer from "@/layouts/SetupContainer";
import { SetupStatus } from "@/models/setup.model";

type Props = {
  status: SetupStatus;
  message: string;
  onRetry: () => void;
};

export default function WaitScreen({ status, message, onRetry }: Props) {
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
    <SetupContainer currentStep={null}>
      <section className="flex h-full max-w-3xl flex-col items-center justify-center gap-y-8 lg:p-8">
        <Spinner size="lg" />

        <div>
          <Headline>{headline}</Headline>

          <p className="m-2 text-center text-secondary">{details}</p>
        </div>

        {status === SetupStatus.ERROR && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded bg-yellow-500 px-5 py-2 font-semibold text-black hover:bg-yellow-400"
          >
            {t("setup.retry", { defaultValue: "Retry" })}
          </button>
        )}
      </section>
    </SetupContainer>
  );
}
