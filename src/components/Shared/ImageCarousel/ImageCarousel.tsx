import { FC, useState } from "react";
import { ReactComponent as ChevronLeft } from "../../../assets/chevron-left.svg";

type Props = {
  imgs: string[];
};

const ImageCarousel: FC<Props> = ({ imgs }) => {
  const [activeImg, setActiveImg] = useState<number>(0);

  const back = () => {
    setActiveImg((prev) => (prev - 1 < 0 ? imgs.length - 1 : prev - 1));
  };

  const next = () => {
    setActiveImg((prev) => (prev + 1 >= imgs.length ? 0 : prev + 1));
  };

  const switchImgHandler = (index: number) => {
    setActiveImg(index);
  };

  return (
    <div className="relative inline-block">
      <div className="absolute left-0 right-0 bottom-0 mb-5 flex justify-center gap-5 p-0">
        {imgs.map((_, index) => {
          if (activeImg === index) {
            return (
              <button
                key={index}
                type="button"
                className="z-10 h-3 w-10 border border-black bg-white"
                onClick={() => switchImgHandler(index)}
              ></button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className="z-10 h-3 w-10 border border-black bg-white opacity-30 hover:opacity-75"
              onClick={() => switchImgHandler(index)}
            ></button>
          );
        })}
      </div>
      <div className="overflow-hidden px-5">
        {imgs.map((img, index) => {
          if (index === activeImg) {
            return (
              <img key={index} src={img} alt={"" + index} className="block" />
            );
          }
          return (
            <img key={index} src={img} alt={"" + index} className="hidden" />
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 mx-5 flex h-full justify-between">
        <button
          onClick={back}
          className="z-10 flex w-20 items-center justify-center opacity-30 hover:opacity-100"
        >
          <ChevronLeft className="h-8 w-8 text-white" />
        </button>
        <button
          onClick={next}
          className="z-10 flex w-20 items-center justify-center opacity-30 hover:opacity-100"
        >
          <ChevronLeft className="h-8 w-8 rotate-180 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
