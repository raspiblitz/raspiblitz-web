import { CircularProgress } from "@heroui/react";
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
      <CircularProgress
        aria-label={`${conf} confirmations out of ${required}`}
        classNames={{
          svg: "w-[7.5rem] h-[7.5rem]",
          indicator: "stroke-green-500",
          track: "stroke-gray-700",
          value: "text-[1.2rem] font-bold",
        }}
        value={progressValue}
        valueLabel={
          showLabel ? (
            <span
              className="font-semibold text-[0.625rem]"
              style={{ color: "#D1D5DB" }}
            >
              {t("tx.unconfirmed")}
            </span>
          ) : isFullyConfirmed ? (
            <span
              className="font-bold text-[1.2rem]"
              style={{ color: "#E5E7EB" }}
            >
              {conf}
            </span>
          ) : (
            <div className="flex flex-col items-center">
              <span
                className="font-bold text-[1.2rem]"
                style={{ color: "#E5E7EB" }}
              >
                {conf}
              </span>
              <span className="text-[0.8rem]" style={{ color: "#9CA3AF" }}>
                / {required}
              </span>
            </div>
          )
        }
        showValueLabel={true}
      />
      <div className="text-sm font-medium text-gray-300">
        {t("tx.confirmations")}
      </div>
    </div>
  );
};

export default ConfirmationsRing;
