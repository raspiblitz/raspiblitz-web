import { render, screen, act } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import { AppCard } from "./AppCard";

const app = {
  id: "123",
  description: "Hi",
  name: "d",
};

const basicProps = {
  installingApp: null,
  app: app,
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
