import type { FC } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  confirmations: number | null;
  required?: number;
}

/**
 * Displays confirmation status as a segmented circular progress indicator.
 * Shows 6 segments, with filled segments representing completed confirmations.
 */
export const ConfirmationsRing: FC<Props> = ({
  confirmations = 0,
  required = 6,
}) => {
  const { t } = useTranslation();
  const conf = confirmations || 0;
  const filledSegments = Math.min(conf, required);
  const isFullyConfirmed = conf >= required;
  const showLabel = conf === 0;

  // Generate 6 segments arranged in a circle
  const segments = Array.from({ length: 6 }, (_, i) => {
    const angle = (i * 360) / 6 - 90; // Start from top
    const radius = 45;
    const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
    const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
    const isFilled = i < filledSegments;

    return {
      id: i,
      x,
      y,
      isFilled,
      angle,
    };
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        className="mx-auto"
        role="img"
        aria-label={`${conf} confirmations out of ${required}`}
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="rgb(55, 65, 81)"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Segments */}
        {segments.map((segment) => {
          const innerRadius = 30;
          const outerRadius = 45;
          const startAngle = (segment.angle * Math.PI) / 180;
          const endAngle = ((segment.angle + 60 - 6) * Math.PI) / 180; // 60 degrees per segment, small gap

          // Calculate path for segment
          const x1 = 50 + innerRadius * Math.cos(startAngle);
          const y1 = 50 + innerRadius * Math.sin(startAngle);
          const x2 = 50 + outerRadius * Math.cos(startAngle);
          const y2 = 50 + outerRadius * Math.sin(startAngle);
          const x3 = 50 + outerRadius * Math.cos(endAngle);
          const y3 = 50 + outerRadius * Math.sin(endAngle);
          const x4 = 50 + innerRadius * Math.cos(endAngle);
          const y4 = 50 + innerRadius * Math.sin(endAngle);

          const largeArc = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;

          const path = `
            M ${x1} ${y1}
            L ${x2} ${y2}
            A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x3} ${y3}
            L ${x4} ${y4}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x1} ${y1}
            Z
          `;

          return (
            <path
              key={segment.id}
              d={path}
              fill={
                segment.isFilled ? "rgb(34, 197, 94)" : "rgb(107, 114, 128)"
              }
              opacity={segment.isFilled ? 1 : 0.3}
              stroke="none"
            />
          );
        })}

        {/* Center text */}
        {showLabel ? (
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="10"
            fill="rgb(209, 213, 219)"
            className="font-semibold"
          >
            {t("tx.unconfirmed")}
          </text>
        ) : isFullyConfirmed ? (
          <text
            x="50"
            y="54"
            textAnchor="middle"
            fontSize="16"
            fill="rgb(229, 231, 235)"
            fontWeight="bold"
          >
            {conf}
          </text>
        ) : (
          <>
            <text
              x="50"
              y="48"
              textAnchor="middle"
              fontSize="16"
              fill="rgb(229, 231, 235)"
              fontWeight="bold"
            >
              {conf}
            </text>
            <text
              x="50"
              y="60"
              textAnchor="middle"
              fontSize="11"
              fill="rgb(156, 163, 175)"
            >
              / {required}
            </text>
          </>
        )}
      </svg>

      <div className="text-sm font-medium text-gray-300">
        {t("tx.confirmations")}
      </div>
    </div>
  );
};

export default ConfirmationsRing;
