import I18nSelect from "@/components/I18nDropdown";
import Stepper from "@/pages/Setup/Stepper";
import { PropsWithChildren } from "react";

type Props = {
  currentStep: number | null;
};

export default function SetupContainer({
  currentStep,
  children,
}: PropsWithChildren<Props>) {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-primary-900 transition-colors text-white">
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nSelect />
      </div>

      {currentStep !== null && (
        <div className="fixed top-12 flex items-center justify-around w-1/3">
          <Stepper currentStep={currentStep} />
        </div>
      )}

      <div>{children}</div>
    </main>
  );
}
