import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { type FC, useState } from "react";
import { useTranslation } from "react-i18next";

type Props = { imgs: string[]; video?: React.JSX.Element; appName?: string };

const ImageCarousel: FC<Props> = ({ imgs, video, appName }) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const videoOffset = video ? 1 : 0;
  const count = imgs.length + videoOffset;
  const current = Math.min(activeIndex, Math.max(0, count - 1));
  const imageIndex = current - videoOffset;
  if (!count) return null;
  const controlClass =
    "flex min-h-11 min-w-11 items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
  return (
    <div role="region" aria-label={t("carousel.label", { appName })} className="w-full">
      <div className="flex justify-center overflow-hidden px-5">
        {video && current === 0 ? (
          video
        ) : (
          <img
            src={imgs[imageIndex]}
            alt={t("carousel.screenshot", { appName, index: imageIndex + 1, total: imgs.length })}
            className="block h-auto max-w-full object-contain"
          />
        )}
      </div>
      {count > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 p-3">
          <button
            type="button"
            aria-label={t("carousel.previous")}
            className={controlClass}
            onClick={() => setActiveIndex((current - 1 + count) % count)}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={
                video && index === 0
                  ? t("carousel.show_video")
                  : t("carousel.show_screenshot", { index: index - videoOffset + 1 })
              }
              aria-current={current === index ? "true" : undefined}
              className={controlClass}
              onClick={() => setActiveIndex(index)}
            >
              <span
                className={`h-2 w-6 border border-white ${current === index ? "bg-white" : "bg-transparent"}`}
              />
            </button>
          ))}
          <button
            type="button"
            aria-label={t("carousel.next")}
            className={controlClass}
            onClick={() => setActiveIndex((current + 1) % count)}
          >
            <ChevronLeftIcon className="h-6 w-6 rotate-180" />
          </button>
        </div>
      )}
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {t("carousel.slide", { index: current + 1, total: count })}
      </p>
    </div>
  );
};
export default ImageCarousel;
