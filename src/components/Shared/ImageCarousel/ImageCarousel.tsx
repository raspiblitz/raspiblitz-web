import { FC, useState } from "react";
import { ReactComponent as ChevronLeft } from "../../../assets/chevron-left.svg";

type Props = {
  imgs: any[];
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
    <div className="inline-block relative">
      <div className="absolute left-0 right-0 bottom-0 flex justify-center gap-5 p-0 mb-5">
        {imgs.map((_, index) => {
          if (activeImg === index) {
            return (
              <button
                key={index}
                type="button"
                className="bg-white h-3 w-10 z-10"
                onClick={() => switchImgHandler(index)}
              ></button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className="bg-white h-3 w-10 z-10 opacity-30 hover:opacity-75"
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
      <div className="absolute bottom-0 left-0 right-0 flex justify-between h-full mx-5">
        <button
          onClick={back}
          className="w-20 flex justify-center items-center z-10 opacity-30 hover:opacity-100"
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <button
          onClick={next}
          className="w-20 flex justify-center items-center z-10 opacity-30 hover:opacity-100"
        >
          <ChevronLeft className="rotate-180 w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
