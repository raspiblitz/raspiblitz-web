import {
  AppContext,
  appContextDefault,
  AppContextType,
} from "@/context/app-context";
import {
  WebSocketContext,
  websocketContextDefault,
  WebSocketContextType,
} from "@/context/ws-context";
import i18n from "@/i18n/test_config";
import { render, RenderOptions } from "@testing-library/react";
import { FC, PropsWithChildren, ReactElement } from "react";
import { I18nextProvider } from "react-i18next";
import { BrowserRouter } from "react-router-dom";

type Props = {
  sseProps: WebSocketContextType;
  appProps: AppContextType;
};

const AllTheProviders: FC<PropsWithChildren<Props>> = ({
  children,
  appProps,
  sseProps,
}) => {
  return (
    <BrowserRouter>
      <WebSocketContext.Provider
        value={{
          ...websocketContextDefault,
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
      </WebSocketContext.Provider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    providerOptions?: {
      sseProps?: Partial<WebSocketContextType>;
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
