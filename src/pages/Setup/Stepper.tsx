import { cn } from "@nextui-org/react";
import { useTranslation } from "react-i18next";

const NUMBER_OF_STEPS = 4;

type Props = {
  currentStep: number;
};

export default function Stepper({ currentStep }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "w-full",
        "after:block after:relative after:bottom-5 after:border after:border-gray-700 after:content-['']",
      )}
    >
      <ul className="lg:flex hidden justify-between items-center relative z-10">
        {Array.from({ length: NUMBER_OF_STEPS }).map((_, index: number) => (
          <li className="list-none px-4 bg-primary-900" key={index}>
            <span
              className={cn(
                "text-center flex flex-col",
                index >= currentStep && "opacity-30",
              )}
            >
              <span className="font-bold whitespace-nowrap">
                {t(`setup.step.step`)} {index + 1}
              </span>
              <span className="text-sm text-secondary">
                {t(`setup.step.step_${index + 1}_description`)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
