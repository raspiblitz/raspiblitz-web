import { FC, useEffect, useState } from "react";

type Props = {
  appId: string;
};

const AppIcon: FC<Props> = ({ appId }) => {
  const [iconImg, setIconImg] = useState("");
  useEffect(() => {
    import(`../../assets/apps/logos/${appId}.png`)
      .then((image) => {
        setIconImg(image.default);
      })
      .catch((_) => {
        // use fallback icon if image for id doesn't exist
        import("../../assets/cloud.svg")
          .then((img) => setIconImg(img.default))
          .catch((_) => {
            // do nothing if cloud image doesn't exist either
          });
      });
  });
  return <img className="max-h-16" src={iconImg} alt={`${appId} Logo`} />;
};

export default AppIcon;
