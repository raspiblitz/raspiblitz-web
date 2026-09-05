import type { ErrorInfo } from "react";

interface ErrorReportEnvironment {
  appVersion: string;
  buildCommit: string;
  language: string;
  route: string;
  userAgent: string;
  origin: string;
}

function currentEnvironment(): ErrorReportEnvironment {
  return {
    appVersion: __APP_VERSION__,
    buildCommit: __BUILD_COMMIT__,
    language: document.documentElement.lang || navigator.language,
    route: window.location.pathname,
    userAgent: navigator.userAgent,
    origin: window.location.origin,
  };
}

function sanitize(text: string, origin: string): string {
  return origin ? text.split(origin).join("<local-origin>") : text;
}

export function createErrorReport(
  error: Error | undefined,
  errorInfo: ErrorInfo | undefined,
  environment: ErrorReportEnvironment = currentEnvironment(),
): string {
  const errorStack = sanitize(error?.stack ?? "Not available", environment.origin);
  const componentStack = sanitize(errorInfo?.componentStack ?? "Not available", environment.origin);
  const errorMessage = sanitize(error?.message ?? "Unknown error", environment.origin);

  return [
    "RaspiBlitz Web error report",
    `Web version: ${environment.appVersion}`,
    `Build commit: ${environment.buildCommit}`,
    `Route: ${environment.route}`,
    `Language: ${environment.language}`,
    `Browser: ${environment.userAgent}`,
    "",
    `Error: ${error?.name ?? "UnknownError"}: ${errorMessage}`,
    "",
    "JavaScript stack:",
    errorStack,
    "",
    "React component stack:",
    componentStack,
  ].join("\n");
}
