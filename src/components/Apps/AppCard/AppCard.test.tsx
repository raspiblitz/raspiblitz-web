import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import { AppStatus, AuthMethod } from "../../../models/app-status";
import { App } from "../../../models/app.model";
import { AppCard, Props } from "./AppCard";

const app: App = {
  id: "123",
  author: "Me",
  name: "someApp",
  repository: "http://example.com",
  version: "1.0.0",
};

const appStatus: AppStatus = {
  id: "123",
  installed: false,
  address: "",
  authMethod: AuthMethod.NONE,
  details: "",
  hiddenService: "",
  httpsForced: "0",
  httpsSelfsigned: "0",
  error: "",
};

const basicProps: Props = {
  installingApp: null,
  appInfo: app,
  appStatusInfo: appStatus,
  installed: false,
  onInstall: () => {},
  onOpenDetails: () => {},
};

describe("AppCard", () => {
  test("display install button if installed is false", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AppCard {...basicProps} installed={false} />
      </I18nextProvider>
    );
    expect(await screen.findByText("apps.install")).toBeDefined();
  });

  test("display open button if installed & address is available", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AppCard {...basicProps} address={"addr"} installed={true} />
      </I18nextProvider>
    );
    expect(await screen.findByText("apps.open")).toBeDefined();
  });

  test("display no_page button if installed & address is not available", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <AppCard {...basicProps} installed={true} />
      </I18nextProvider>
    );
    expect(await screen.findByText("apps.no_page")).toBeDefined();
  });
});
