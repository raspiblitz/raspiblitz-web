import { Button } from "@/components/Button";
import I18nSelect from "@/components/I18nDropdown";
import Stepper from "@/pages/Setup/Stepper";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren } from "react";

type Props = {
  currentStep: number | null;
};

export default function SetupContainer({
  currentStep,
  children,
}: PropsWithChildren<Props>) {
  return (
    <main className="flex min-h-screen h-full w-screen flex-col items-center justify-center bg-primary-900 transition-colors text-white">
      <div className="fixed md:right-16 top-16 md:top-8 flex h-8 w-48 md:w-96 md:flex-row flex-col-reverse gap-6 md:gap-4 justify-center items-center">
        <Button
          as="a"
          href="https://docs.raspiblitz.org/"
          target="_blank"
          rel="noreferrer"
          color="primary"
          variant="ghost"
          className="p-4 w-full"
          startContent={<BookOpenIcon className="w-5 h-5" />}
        >
          Documentation
        </Button>
        <I18nSelect />
      </div>

      {currentStep !== null && (
        <div className="fixed mb-4 top-24 flex items-center justify-around w-1/3">
          <Stepper currentStep={currentStep} />
        </div>
      )}

      <div>{children}</div>
    </main>
  );
}
