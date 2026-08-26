import type { TFunction } from "i18next";
import { Component, type ErrorInfo, type PropsWithChildren } from "react";
import { withTranslation } from "react-i18next";
import { createErrorReport } from "@/utils/error-report";

interface Props {
  t: TFunction<[string, string], undefined>;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  copied: boolean;
}

class ErrorBoundary extends Component<PropsWithChildren<Props>, State> {
  public state: State = {
    hasError: false,
    copied: false,
  };

  public static getDerivedStateFromError(
    _error: Error,
  ): Pick<State, "hasError"> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo, error });
    console.error("Uncaught error:", error, errorInfo);
  }

  private copyReport = async () => {
    const report = createErrorReport(this.state.error, this.state.errorInfo);

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(report);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = report;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }
      this.setState({ copied: true });
    } catch {
      this.setState({ copied: false });
    }
  };

  public render() {
    if (this.state.hasError) {
      const { t } = this.props;
      const report = createErrorReport(this.state.error, this.state.errorInfo);
      return (
        <main className="flex min-h-screen w-screen flex-col items-center justify-center gap-5 bg-gray-700 p-6 text-white transition-colors">
          <h1 className="text-xl font-bold">{t("login.error")} 😓</h1>
          <section>
            <p className="rounded bg-red-500 p-2 text-center text-white">
              {this.state.error?.name}:{this.state.error?.message}
            </p>
            <p className="mt-2">
              {t("error.report")}{" "}
              <a
                href="https://github.com/raspiblitz/raspiblitz-web/issues"
                className="cursor-pointer text-blue-500"
              >
                https://github.com/raspiblitz/raspiblitz-web/issues
              </a>
            </p>
          </section>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={this.copyReport}
              className="rounded bg-yellow-500 px-4 py-2 font-semibold text-black"
            >
              {this.state.copied ? "Copied" : "Copy diagnostic report"}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded bg-gray-500 px-4 py-2 font-semibold text-white"
            >
              Reload page
            </button>
          </div>
          <section className="w-full max-w-4xl">
            <p>{t("error.stack")}:</p>
            <pre className="mt-2 max-h-80 overflow-auto whitespace-pre-wrap rounded bg-gray-900 p-3 text-xs">
              {report}
            </pre>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
