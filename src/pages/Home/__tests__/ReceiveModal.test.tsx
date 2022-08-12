import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import { rest, server } from "../../../testServer";
import ReceiveModal from "../ReceiveModal";

beforeAll(() => {
  server.use(
    rest.post("/api/v1/lightning/new-address", (_, res, ctx) => {
      return res(ctx.body("bcrt1qvh74klc36lefsdgq5r2d44vwxxzkdsch0hhyrz"));
    })
  );
});

describe("ReceiveModal", () => {
  test("Retrieves new on-chain address on click of on-chain button", async () => {
    const user = userEvent.setup();
    render(
      <I18nextProvider i18n={i18n}>
        <ReceiveModal onClose={() => {}} />
      </I18nextProvider>
    );

    const onChainBtn = await screen.findByText("wallet.on_chain");

    await user.click(onChainBtn);

    expect(await screen.findByRole("img")).toBeDefined();
  });
});
