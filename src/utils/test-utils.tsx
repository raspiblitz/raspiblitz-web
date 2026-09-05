import { type RenderOptions, render } from "@testing-library/react";
import type { FC, PropsWithChildren, ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router";
import { AppContext, type AppContextType, appContextDefault } from "@/context/app-context";
import {
  RealtimeContext,
  type RealtimeContextType,
  realtimeContextDefault,
} from "@/context/realtime-context";
import i18n from "@/i18n/test_config";

type Props = {
  realtimeProps: RealtimeContextType;
  appProps: AppContextType;
};

const AllTheProviders: FC<PropsWithChildren<Props>> = ({ children, appProps, realtimeProps }) => {
  return (
    <BrowserRouter>
      <RealtimeContext.Provider
        value={{
          ...realtimeContextDefault,
          ...realtimeProps,
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
      </RealtimeContext.Provider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    providerOptions?: {
      realtimeProps?: Partial<RealtimeContextType>;
      appProps?: Partial<AppContextType>;
    };
  },
) =>
  render(ui, {
    wrapper: (props: any) => <AllTheProviders {...props} {...options?.providerOptions} />,
    ...options,
  });

export * from "@testing-library/react";
export { customRender as render };

export const mockedDisclosure = {
  isOpen: true,
  setOpen: vi.fn(),
  open: vi.fn(),
  close: vi.fn(),
  toggle: vi.fn(),
};
