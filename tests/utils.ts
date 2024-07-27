import {Route} from "@playwright/test";

export const fulfillRoute = async (route: Route, json: any) => {
    await route.fulfill({json});
};
