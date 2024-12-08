import { type AppStatus, AuthMethod } from "@/models/app-status";
import type { App } from "@/models/app.model";
import { render, screen } from "test-utils";
import { AppCard, type Props } from "../AppCard";

const app: App = {
	id: "123",
	author: "Me",
	name: "someApp",
	repository: "http://example.com",
};

const appStatus: AppStatus = {
	id: "123",
	installed: false,
	authMethod: AuthMethod.NONE,
	details: "",
	hiddenService: "",
	httpsForced: "0",
	httpsSelfsigned: "0",
	error: "",
	version: "1.0.0",
};

const basicProps: Props = {
	installingApp: null,
	appInfo: app,
	appStatusInfo: appStatus,
	installed: false,
	onInstall: () => {},
};

describe("AppCard", () => {
	test("display install button if installed is false", async () => {
		render(<AppCard {...basicProps} installed={false} />);
		expect(await screen.findByText("apps.install")).toBeDefined();
	});

	test("display open button if installed & address is available", async () => {
		const props = {
			...basicProps,
			appStatusInfo: {
				...basicProps.appStatusInfo,
				address: "https://bla.com",
			},
		};
		render(<AppCard {...props} installed={true} />);
		expect(await screen.findByText("apps.open")).toBeDefined();
	});

	test("display no_page button if installed & address is not available", async () => {
		render(<AppCard {...basicProps} installed={true} />);
		expect(await screen.findByText("apps.no_page")).toBeDefined();
	});
});
