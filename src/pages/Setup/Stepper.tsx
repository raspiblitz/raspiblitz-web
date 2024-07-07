import { useTranslation } from "react-i18next";

const NUMBER_OF_STEPS = 4;

type Props = {
  currentStep: number;
};

export default function Stepper({ currentStep }: Props) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <ul className="lg:flex hidden justify-center items-center gap-4">
        {Array.from({ length: NUMBER_OF_STEPS }).map((_, index: number) => (
          <>
            <li
              className={`list-none text-center flex flex-col ${index < currentStep ? "opacity-100" : "opacity-30"}`}
              key={index}
            >
              <span className="font-bold">
                {t(`setup.step.step`)} {index + 1}
              </span>
              <span className="text-sm">
                {t(`setup.step.step_${index + 1}_description`)}
              </span>
            </li>
            {index < NUMBER_OF_STEPS - 1 && (
              <div className="border-b w-16"></div>
            )}
          </>
        ))}
      </ul>
    </div>
  );
}
