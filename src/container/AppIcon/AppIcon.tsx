import type { FC } from "react";

type Props = {
  appId: string;
};

const AppIcon: FC<Props> = ({ appId }) => {
  return (
    <img
      className="max-h-16"
      src={`/assets/apps/logos/${appId}.png`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = "/assets/cloud.svg";
      }}
      alt={`${appId} Logo`}
    />
  );
};

export default AppIcon;
