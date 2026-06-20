import { BookOpenIcon } from "@heroicons/react/24/outline";
import { Link } from "@heroui/react";
import { buttonVariants } from "@heroui/styles";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import I18nSelect from "@/components/I18nDropdown";
import Stepper from "@/pages/Setup/Stepper";

type Props = {
  currentStep: number | null;
};

export default function SetupContainer({
  currentStep,
  children,
}: PropsWithChildren<Props>) {
  const { t } = useTranslation();

  return (
    <main className="flex h-full min-h-screen w-screen flex-col items-center justify-center bg-accent-900 text-white transition-colors">
      <div className="fixed top-16 flex h-8 w-48 flex-col-reverse items-center justify-center gap-6 md:right-16 md:top-6 md:w-96 md:flex-row md:gap-4">
        <Link
          href="https://docs.raspiblitz.org/"
          target="_blank"
          rel="noreferrer"
          className={buttonVariants({
            variant: "ghost",
            className: "w-full rounded-full p-4 font-semibold",
          })}
        >
          <span className="flex items-center gap-2">
            <BookOpenIcon className="h-5 w-5" />
            {t("navigation.documentation")}
          </span>
        </Link>
        <I18nSelect />
      </div>

      {currentStep !== null && (
        <div className="fixed top-20 mb-4 flex w-1/3 items-center justify-around">
          <Stepper currentStep={currentStep} />
        </div>
      )}

      <div>{children}</div>
    </main>
  );
}
