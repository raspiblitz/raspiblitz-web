import { Component, ErrorInfo, ReactNode } from "react";
import { withTranslation } from "react-i18next";

interface Props {
  t: any;
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
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
        <main className="flex h-screen w-screen flex-col items-center justify-center gap-5 bg-gray-100 p-10 transition-colors dark:bg-gray-700 dark:text-white">
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
