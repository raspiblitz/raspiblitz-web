import { Headline } from "@/components/Headline";
import { SSEContext } from "@/context/sse-context";
import PageLoadingScreen from "@/layouts/PageLoadingScreen";
import type { AdvancedAppStatusElectron } from "@/models/advanced-app-status";
import { checkError } from "@/utils/checkError";
import { instance } from "@/utils/interceptor";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Snippet,
	Tab,
	Tabs,
} from "@nextui-org/react";
import { QRCodeSVG } from "qrcode.react";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Electrs = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { appStatus } = useContext(SSEContext);
	const [isLoading, setIsLoading] = useState(true);
	const [appData, setAppData] = useState<AdvancedAppStatusElectron | null>(
		null,
	);
	const [QRAddressLocal, setQRAddressLocal] = useState<string | null>(null);
	const [QRAddressTor, setQRAddressTor] = useState<string | null>(null);

	useEffect(() => {
		if (!appData) {
			instance
				.get("apps/status_advanced/electrs")
				.then((resp) => {
					setAppData(resp.data);
					if (resp.data?.TORaddress && resp.data?.portSSL) {
						setQRAddressTor(`${resp.data.TORaddress}:${resp.data.portSSL}:s`);
					}
					if (resp.data?.localIP && resp.data?.portSSL) {
						setQRAddressLocal(`${resp.data.localIP}:${resp.data.portSSL}:s`);
					}
					setIsLoading(false);
				})
				.catch((error) => {
					checkError(error);
				});
		}
	}, [appData]);

	if (isLoading || !appData || !appStatus) {
		return <PageLoadingScreen />;
	}

	const { TORaddress, portSSL, localIP, version, initialSyncDone } = appData;

	if (appStatus.find((app) => app.id === "electrs")?.installed === false) {
		navigate("/apps");
		return null;
	}

	return (
		<main className="page-container content-container flex w-full flex-col items-center bg-gray-700 text-white">
			{/* Back Button */}
			<section className="w-full px-5 py-9 text-gray-200">
				<Button
					onClick={() => navigate("/apps")}
					color="primary"
					startContent={<ChevronLeftIcon className="inline-block h-5 w-5" />}
				>
					{t("navigation.back")}
				</Button>
			</section>

			<Card className="bd-card w-full md:w-11/12">
				<CardHeader>
					<Headline as="h3" size="xl">
						Electrs Version <span className="font-bold">{version}</span>
					</Headline>
				</CardHeader>
				<CardBody className="flex">
					{!initialSyncDone ? (
						<span>{t("appInfo.electrs.initialSync")}</span>
					) : (
						<>
							<span className="mb-4">
								{t("appInfo.electrs.connectionInfo")}
							</span>
							<Tabs
								aria-label="Connection Options"
								color="primary"
								size="lg"
								className="justify-center"
							>
								<Tab key="local" title="Local Connection">
									<span>{t("appInfo.electrs.connectLocal")}: </span>
									{QRAddressLocal ? (
										<div className="mt-4 flex flex-col items-center justify-center gap-4">
											<QRCodeSVG
												value={QRAddressLocal}
												size={256}
												className="border-2 border-white"
											/>
											<Snippet
												classNames={{
													base: "max-w-[80%] text-white",
													pre: "text-ellipsis",
												}}
												symbol=""
												color="primary"
												variant="solid"
											>
												{`${localIP}:${portSSL}:s`}
											</Snippet>
										</div>
									) : (
										<span className="mt-4 text-center">
											{t("appInfo.electrs.not_available")}
										</span>
									)}
								</Tab>
								<Tab key="tor" title="Tor">
									<span>{t("appInfo.electrs.connectTor")}:</span>
									{QRAddressTor ? (
										<div className="mt-4 flex flex-col items-center justify-center gap-4">
											<QRCodeSVG
												value={QRAddressTor}
												size={256}
												className="border-2 border-white"
											/>
											<Snippet
												classNames={{
													base: "max-w-[80%] text-white",
													pre: "overflow-hidden text-ellipsis",
												}}
												symbol=""
												color="primary"
												variant="solid"
											>
												{`${TORaddress}:${portSSL}:s`}
											</Snippet>
										</div>
									) : (
										<span className="mt-4 text-center">
											{t("appInfo.electrs.not_available")}
										</span>
									)}
								</Tab>
							</Tabs>
						</>
					)}
				</CardBody>
			</Card>
		</main>
	);
};

export default Electrs;
