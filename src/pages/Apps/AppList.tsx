import type { AppStatus } from "@/models/app-status";
import { availableApps } from "@/utils/availableApps";
import type { FC } from "react";
import AppCard from "./AppCard";

type Props = {
	title: string;
	apps: AppStatus[];
	onInstall: (id: string) => void;
};

const AppList: FC<Props> = ({ title, apps, onInstall }) => {
	return (
		<section className="flex h-full flex-wrap">
			<h2 className="w-full pb-5 pt-8 text-xl font-bold text-gray-200">
				{title}
			</h2>
			<div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
				{apps.map((appStatus: AppStatus) => {
					return (
						<AppCard
							key={appStatus.id}
							// biome-ignore lint/style/noNonNullAssertion: <explanation>
							appInfo={availableApps[appStatus.id]!}
							appStatusInfo={appStatus}
							installed={appStatus.installed}
							installingApp={null}
							onInstall={onInstall}
						/>
					);
				})}
			</div>
		</section>
	);
};

export default AppList;
