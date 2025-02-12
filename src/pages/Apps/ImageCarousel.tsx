import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { type FC, useState } from "react";

type Props = {
  imgs: string[];
  video?: React.JSX.Element;
};

const ImageCarousel: FC<Props> = ({ imgs, video }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const back = () => {
    const length = video ? imgs.length : imgs.length - 1;
    setActiveIndex((prev) => (prev - 1 < 0 ? length : prev - 1));
  };

  const next = () => {
    const length = video ? imgs.length + 1 : imgs.length;
    setActiveIndex((prev) => (prev + 1 >= length ? 0 : prev + 1));
  };

  const switchImgHandler = (index: number) => {
    setActiveIndex(index);
  };

  if (!imgs.length) {
    return <></>;
  }

  return (
    <div className="relative inline-block">
      <div className="absolute bottom-0 left-0 right-0 z-20 mb-5 flex justify-center gap-5 p-0">
        {((video && activeIndex !== 0) || !video) &&
          imgs.map((_, index) => {
            const idx = video ? activeIndex - 1 : activeIndex;
            if (idx === index) {
              return (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={index}
                  type="button"
                  className="z-10 h-3 w-10 border border-black bg-white"
                  onClick={() => switchImgHandler(index)}
                />
              );
            }

            return (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                type="button"
                className="z-10 h-3 w-10 border border-black bg-white opacity-30 hover:opacity-75"
                onClick={() => switchImgHandler(index)}
              />
            );
          })}
      </div>
      <div className="relative z-10 overflow-hidden px-5">
        {video && activeIndex === 0 ? (
          video
        ) : (
          <img
            src={imgs[video ? activeIndex - 1 : activeIndex]}
            alt={`${activeIndex}`}
            className="block"
          />
        )}
      </div>
      <div className="absolute bottom-0 left-0 right-0 mx-5 flex h-full justify-between">
        <button
          type="button"
          onClick={back}
          className="z-10 flex w-20 items-center justify-center opacity-70 hover:opacity-100"
        >
          <ChevronLeftIcon className="h-8 w-8 text-gray-700" />
        </button>
        <button
          type="button"
          onClick={next}
          className="z-10 flex w-20 items-center justify-center opacity-70 hover:opacity-100"
        >
          <ChevronLeftIcon className="h-8 w-8 rotate-180 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
