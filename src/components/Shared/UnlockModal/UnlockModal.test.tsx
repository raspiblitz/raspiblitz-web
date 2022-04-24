import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nextProvider } from "react-i18next";
import i18n from "../../../i18n/test_config";
import { rest, server } from "../../../testServer";
import UnlockModal from "./UnlockModal";

const handleClose = jest.fn();

describe("UnlockModal", () => {
  const setup = () => {
    render(
      <I18nextProvider i18n={i18n}>
        <UnlockModal onClose={handleClose} />
      </I18nextProvider>
    );
  };

  test("renders", () => {
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    expect(input).toHaveClass("input-underline");
    expect(input).toBeInTheDocument();
  });

  // https://github.com/cstenglein/raspiblitz-web/issues/234
  // skipped due to react v18 update
  test.skip("should enable button if input is not empty", async () => {
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");

    const button = screen.getByRole("button");

    expect(button).toBeDisabled();

    userEvent.type(input, "1234");
    expect(await screen.findByRole("button")).toBeEnabled();
  });

  // https://github.com/cstenglein/raspiblitz-web/issues/234
  // skipped due to react v18 update
  test.skip("should show text on wrong password", async () => {
    server.use(
      rest.post("/api/v1/lightning/unlock-wallet", (_, res, ctx) => {
        return res(ctx.status(401));
      })
    );

    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    userEvent.type(input, "1234");
    userEvent.click(screen.getByText("wallet.unlock"));

    expect(await screen.findByText("login.invalid_pass")).toBeInTheDocument();
  });

  // https://github.com/cstenglein/raspiblitz-web/issues/234
  // skipped due to react v18 update
  test.skip("should display unlocking text on nlock", async () => {
    server.use(
      rest.post("/api/v1/lightning/unlock-wallet", (_, res, ctx) => {
        return res(ctx.status(200));
      })
    );

    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    userEvent.type(input, "1234");
    userEvent.click(await screen.findByText("wallet.unlock"));

    expect(await screen.findByText("wallet.unlocking")).toBeInTheDocument();
  });
});
