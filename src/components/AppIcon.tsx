import type { FC } from "react";

type Props = {
	appId: string;
	className?: string;
};

const AppIcon: FC<Props> = ({ appId, className = "" }) => {
	return (
		<img
			className={`${className}`}
			src={`/assets/apps/logos/${appId}.png`}
			onError={(e) => {
				(e.target as HTMLImageElement).src = "/assets/cloud.svg";
			}}
			alt={`${appId} Logo`}
		/>
	);
};

export default AppIcon;
