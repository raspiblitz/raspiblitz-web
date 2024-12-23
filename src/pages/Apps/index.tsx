import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import type { AppStatus } from "@/models/app-status";
import { enableGutter } from "@/utils";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import type { FC } from "react";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import AppCardAlby from "./AppCardAlby";
import AppList from "./AppList";

export const Apps: FC = () => {
	const { t } = useTranslation(["translation", "apps"]);
	const { lnInfo } = useContext(SSEContext);
	let { appStatus } = useContext(SSEContext);

	useEffect(() => {
		enableGutter();
	}, []);

	// alby hub only works on LND currently, so we filter the entry out on non LND nodes
	if (lnInfo.implementation !== "LND_GRPC") {
		appStatus = appStatus.filter((app: AppStatus) => app.id !== "albyhub");
	}

	// on every render sort installed & uninstalled app keys
	const installedApps = appStatus.filter((app: AppStatus) => {
		return app.installed;
	});
	const notInstalledApps = appStatus.filter((app: AppStatus) => {
		return !app.installed;
	});

	const installHandler = (id: string) => {
		instance.post(`apps/install/${id}`).catch((err) => {
			toast.error(checkError(err));
		});
	};

	// in case no App data received yet => show loading screen
	if (appStatus.length === 0) {
		return <PageLoadingScreen />;
	}

	return (
		<main className="content-container page-container bg-gray-700 p-5 text-white transition-colors lg:pb-8 lg:pr-8 lg:pt-8">
			<>
				<AppList
					apps={installedApps}
					title={t("apps.installed")}
					onInstall={installHandler}
				/>
				<AppList
					apps={notInstalledApps}
					title={t("apps.available")}
					onInstall={installHandler}
				/>
				<section className="flex h-full flex-wrap pt-8">
					<div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-8">
						<AppCardAlby />
					</div>
				</section>
			</>
		</main>
	);
};

export default Apps;
