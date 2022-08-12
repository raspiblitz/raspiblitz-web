import { render, screen, waitFor } from "@testing-library/react";

import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n/test_config";
import InputField from "../InputField";
import type { InputFieldProps } from "../InputField";

const basicProps: InputFieldProps = {
  label: "Banana Label",
  name: "bananaName",
  ref: () => undefined,
  onChange: async () => undefined,
  onBlur: async () => undefined,
};

describe("InputField", () => {
  test("render with placeholder", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <InputField {...basicProps} placeholder="A yellow fruit" />
      </I18nextProvider>
    );

    const input = await screen.findByLabelText("Banana Label");
    await waitFor(() => expect(input).toHaveClass("input-underline"));
    expect(input).toBeInTheDocument();
    expect(screen.getByPlaceholderText("A yellow fruit")).toBeInTheDocument();
  });

  test("render with error-message", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <InputField
          {...basicProps}
          errorMessage={{ type: "required", message: "Banana required!" }}
        />
      </I18nextProvider>
    );

    const input = await screen.findByLabelText("Banana Label");
    await waitFor(() => expect(input).toHaveClass("input-error"));
    expect(input).toBeInTheDocument();
    expect(screen.getByText("Banana required!")).toBeInTheDocument();
  });

  test("prop inputRightAddon", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <InputField {...basicProps} inputRightAddon="Right add-on text" />
      </I18nextProvider>
    );

    expect(screen.getByText("Right add-on text")).toBeInTheDocument();
  });

  test("prop inputRightElement", async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <InputField
          {...basicProps}
          inputRightElement={<button>Click me!</button>}
        />
      </I18nextProvider>
    );

    expect(screen.getByText("Click me!")).toBeInTheDocument();
  });
});
