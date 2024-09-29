import UnlockModal from "../UnlockModal";
import { http, server, HttpResponse } from "@/testServer";
import userEvent from "@testing-library/user-event";
import { render, screen, mockedDisclosure } from "test-utils";

describe("UnlockModal", () => {
  const setup = () => {
    render(<UnlockModal disclosure={mockedDisclosure} />);
  };

  test("renders", () => {
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    expect(input).toHaveClass("input-underline");
    expect(input).toBeInTheDocument();
  });

  test("should enable button if input is not empty", async () => {
    const user = userEvent.setup();
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    const button = screen.getByRole("button", {
      name: "wallet.unlock",
    });
    expect(button).toBeDisabled();

    await user.type(input, "1234");
    expect(button).toBeEnabled();
  });

  test("should show text on wrong password", async () => {
    server.use(
      http.post("/api/lightning/unlock-wallet", () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const user = userEvent.setup();
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    await user.type(input, "1234");
    await user.click(screen.getByText("wallet.unlock"));

    expect(await screen.findByText("login.invalid_pass")).toBeInTheDocument();
  });

  test("should display unlocking text on unlock", async () => {
    server.use(
      http.post("/api/lightning/unlock-wallet", () => {
        return new HttpResponse(null, { status: 200 });
      }),
    );

    const user = userEvent.setup();
    setup();

    const input = screen.getByPlaceholderText("forms.validation.unlock.pass_c");
    await user.type(input, "1234");
    await user.click(await screen.findByText("wallet.unlock"));

    expect(await screen.findByText("wallet.unlocking")).toBeInTheDocument();
  });
});
