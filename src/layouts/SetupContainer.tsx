import I18nSelect from "@/components/I18nDropdown";
import { AppContext } from "@/context/app-context";
import Stepper from "@/pages/Setup/Stepper";
import { MoonIcon } from "@heroicons/react/24/outline";
import { PropsWithChildren, useContext } from "react";

type Props = {
  currentStep: number | null;
};

export default function SetupContainer({
  currentStep,
  children,
}: PropsWithChildren<Props>) {
  const { toggleDarkMode } = useContext(AppContext);
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-primary-900 transition-colors">
      <MoonIcon
        className="fixed right-4 top-4 h-8 text-white"
        onClick={toggleDarkMode}
      />
      <div className="fixed right-16 top-4 flex h-8 w-48 items-center justify-around">
        <I18nSelect />
      </div>
      {currentStep !== null && (
        <div className="fixed top-12 flex items-center justify-around">
          <Stepper currentStep={currentStep} />
        </div>
      )}

      <div>{children}</div>
    </main>
  );
}
