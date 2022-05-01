import { FC } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  progress: number;
};

// See https://css-tricks.com/building-progress-ring-quickly/
const ProgressCircle: FC<Props> = ({ progress }) => {
  const { t } = useTranslation();
  const circle = document.querySelector("circle");
  if (circle) {
    const radius = circle!.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    circle!.style.strokeDasharray = `${circumference} ${circumference}`;
    circle!.style.strokeDashoffset = `${circumference}`;

    const offset = circumference - (progress / 100) * circumference;
    circle!.style.strokeDashoffset = "" + offset;
  }

  return (
    <svg className="h-64 w-64">
      <circle
        className="origin-[50%_50%] -rotate-90 stroke-orange-400 transition-[stroke-dashoffset] ease-in-out"
        strokeWidth={4}
        fill="transparent"
        r="120"
        cx="128"
        cy="128"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-black dark:fill-white"
      >
        {t("setup.sync_bitcoin_sync")}: {progress}%
      </text>
    </svg>
  );
};

export default ProgressCircle;
