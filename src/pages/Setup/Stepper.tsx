import { cn } from "@heroui/react";
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
        "hidden w-full lg:block",
        "after:relative after:bottom-5 after:block after:border after:border-gray-700 after:content-['']",
      )}
    >
      <ul className="relative z-10 hidden items-center justify-between lg:flex">
        {Array.from({ length: NUMBER_OF_STEPS }).map((_, index: number) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <li className="list-none bg-primary-900 px-4" key={index}>
            <span
              className={cn(
                "flex flex-col text-center",
                index >= currentStep && "opacity-30",
              )}
            >
              <span className="whitespace-nowrap font-bold">
                {t("setup.step.step")} {index + 1}
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
