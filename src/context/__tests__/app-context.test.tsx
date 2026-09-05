import { useContext } from "react";
import { render, screen } from "test-utils";
import AppContextProvider, { AppContext } from "../app-context";
import { ACCESS_TOKEN } from "@/utils";

function Session() {
  const { isLoggedIn } = useContext(AppContext);
  return <span>{isLoggedIn ? "authenticated" : "signed out"}</span>;
}

const token = (exp: unknown) =>
  `header.${btoa(JSON.stringify({ user_id: "admin", iat: 1, exp }))}.signature`;

describe("restoring a saved session", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/settings");
  });
  afterEach(() => {
    localStorage.clear();
    window.history.replaceState({}, "", "/");
  });

  test("restores a token using expiry in seconds", () => {
    localStorage.setItem(ACCESS_TOKEN, token(Date.now() / 1000 + 3600));
    render(
      <AppContextProvider>
        <Session />
      </AppContextProvider>,
    );
    expect(screen.getByText("authenticated")).toBeInTheDocument();
  });

  test.each(["broken", token(undefined), token("9999999999"), token(1)])(
    "removes invalid or expired token %j",
    (value) => {
      localStorage.setItem(ACCESS_TOKEN, value);
      render(
        <AppContextProvider>
          <Session />
        </AppContextProvider>,
      );
      expect(screen.getByText("signed out")).toBeInTheDocument();
      expect(localStorage.getItem(ACCESS_TOKEN)).toBeNull();
    },
  );
});
