import type { Route } from "@playwright/test";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fulfillRoute = async (route: Route, json: any) => {
  await route.fulfill({ json });
};
