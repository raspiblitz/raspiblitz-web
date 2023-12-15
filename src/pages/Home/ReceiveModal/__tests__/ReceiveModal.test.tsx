import userEvent from "@testing-library/user-event";
import { render, screen } from "test-utils";
import { http, server, HttpResponse } from "../../../../testServer";
import ReceiveModal from "../ReceiveModal";

beforeAll(() => {
  server.use(
    http.post("/api/v1/lightning/new-address", () => {
      return new HttpResponse("bcrt1qvh74klc36lefsdgq5r2d44vwxxzkdsch0hhyrz", {
        status: 200,
      });
    }),
  );
});

describe("ReceiveModal", () => {
  test("Retrieves new on-chain address on click of on-chain button", async () => {
    const user = userEvent.setup();
    render(<ReceiveModal onClose={() => {}} />);

    const onChainBtn = await screen.findByText("wallet.on_chain");

    await user.click(onChainBtn);

    expect(await screen.findByRole("img")).toBeDefined();
  });
});
