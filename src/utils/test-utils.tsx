import {
  AppContext,
  appContextDefault,
  AppContextType,
} from "@/context/app-context";
import {
  SSEContext,
  sseContextDefault,
  SSEContextType,
} from "@/context/sse-context";
import i18n from "@/i18n/test_config";
import { render, RenderOptions } from "@testing-library/react";
import { FC, PropsWithChildren, ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

type Props = {
  sseProps: SSEContextType;
  appProps: AppContextType;
};

const AllTheProviders: FC<PropsWithChildren<Props>> = ({
  children,
  appProps,
  sseProps,
}) => {
  return (
    <BrowserRouter>
      <SSEContext.Provider
        value={{
          ...sseContextDefault,
          ...sseProps,
        }}
      >
        <AppContext.Provider
          value={{
            ...appContextDefault,
            ...appProps,
          }}
        >
          <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        </AppContext.Provider>
      </SSEContext.Provider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    providerOptions?: {
      sseProps?: Partial<SSEContextType>;
      appProps?: Partial<AppContextType>;
    };
  },
) =>
  render(ui, {
    wrapper: (props: any) => (
      <AllTheProviders {...props} {...options?.providerOptions} />
    ),
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };

export const mockedDisclosure = {
  isOpen: true,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onOpenChange: vi.fn(),
  isControlled: false,
  getButtonProps: vi.fn(),
  getDisclosureProps: vi.fn(),
};
