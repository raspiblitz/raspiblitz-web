import { render, screen, waitFor } from "test-utils";

import type { InputFieldProps } from "../InputField";
import InputField from "../InputField";

const basicProps: InputFieldProps = {
  label: "Banana Label",
  name: "bananaName",
  ref: () => undefined,
  onChange: async () => undefined,
  onBlur: async () => undefined,
};

describe("InputField", () => {
  test("render with placeholder", async () => {
    render(<InputField {...basicProps} placeholder="A yellow fruit" />);

    const input = await screen.findByLabelText("Banana Label");
    await waitFor(() => expect(input).toHaveClass("input-underline"));
    expect(input).toBeInTheDocument();
    expect(screen.getByPlaceholderText("A yellow fruit")).toBeInTheDocument();
  });

  test("render with error-message", async () => {
    render(
      <InputField
        {...basicProps}
        errorMessage={{ type: "required", message: "Banana required!" }}
      />
    );

    const input = await screen.findByLabelText("Banana Label");
    await waitFor(() => expect(input).toHaveClass("input-error"));
    expect(input).toBeInTheDocument();
    expect(screen.getByText("Banana required!")).toBeInTheDocument();
  });

  test("prop inputRightAddon", async () => {
    render(<InputField {...basicProps} inputRightAddon="Right add-on text" />);

    expect(screen.getByText("Right add-on text")).toBeInTheDocument();
  });

  test("prop inputRightElement", async () => {
    render(
      <InputField
        {...basicProps}
        inputRightElement={<button>Click me!</button>}
      />
    );

    expect(screen.getByText("Click me!")).toBeInTheDocument();
  });
});
