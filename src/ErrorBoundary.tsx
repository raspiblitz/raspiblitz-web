import { TFunction } from "i18next";
import { Component, ErrorInfo, PropsWithChildren } from "react";
import { withTranslation } from "react-i18next";

interface Props {
  t: TFunction<[string, string], undefined>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ ...this.state, errorInfo, error });
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const { t } = this.props;
      return (
        <main className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-gray-700 p-10 text-white transition-colors">
          <h1 className="text-xl font-bold">{t("login.error")} 😓</h1>
          <section>
            <p className="rounded bg-red-500 p-2 text-center text-white">
              {this.state.error?.name}: {this.state.error?.message}
            </p>
            <p className="mt-2">
              {t("error.report")}{" "}
              <a
                href="https://github.com/cstenglein/raspiblitz-web/issues"
                className="cursor-pointer text-blue-500"
              >
                https://github.com/cstenglein/raspiblitz-web/issues
              </a>
            </p>
          </section>
          <section className="md:w-1/2">
            <p>{t("error.stack")}:</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
