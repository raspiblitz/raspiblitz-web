import { ProgressCircle } from "@heroui/react";
import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  confirmations: number | null;
  required?: number;
}

/**
 * Displays confirmation status as a circular progress indicator.
 */
export const ConfirmationsRing: FC<Props> = ({
  confirmations = 0,
  required = 6,
}) => {
  const { t } = useTranslation();
  const conf = confirmations || 0;
  const isFullyConfirmed = conf >= required;
  const showLabel = conf === 0;
  const progressValue = Math.min((conf / required) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-[7.5rem] w-[7.5rem]">
        <ProgressCircle
          aria-label={`${conf} confirmations out of ${required}`}
          value={progressValue}
        >
          <ProgressCircle.Track className="h-full w-full">
            <ProgressCircle.TrackCircle className="stroke-gray-700" />
            <ProgressCircle.FillCircle className="stroke-green-500" />
          </ProgressCircle.Track>
        </ProgressCircle>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {showLabel ? (
            <span className="font-semibold text-[0.625rem] text-gray-300">
              {t("tx.unconfirmed")}
            </span>
          ) : isFullyConfirmed ? (
            <span className="font-bold text-[1.2rem] text-gray-200">
              {conf}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="font-bold text-[1.2rem] text-gray-200">
                {conf}
              </span>
              <span className="text-[0.8rem] text-gray-400">/ {required}</span>
            </div>
          )}
        </div>
      </div>
      <div className="text-sm font-medium text-gray-300">
        {t("tx.confirmations")}
      </div>
    </div>
  );
};

export default ConfirmationsRing;
