import { useContext } from "react";
import { Route, Routes } from "react-router";
import { act, fireEvent, render, screen, waitFor } from "test-utils";
import RealtimeProvider, { RealtimeContext } from "@/context/realtime-context";
import { AppId } from "@/models/app-status";
import { http, HttpResponse, server } from "@/testServer";
import { applyInstallationMessage, parseInstallationMessage } from "@/utils/installation-state";
import AppInfo from "../AppInfo";
import Apps from "../index";
import AppList from "../AppList";
import InstallationStatusCard from "@/components/installation/InstallationStatusCard";

function Controls() {
  const { manageApp, setInstallationStatus } = useContext(RealtimeContext);
  const send = (state: string) => {
    const message = parseInstallationMessage({ id: "lnbits", mode: "on", state, message: state });
    if (message) setInstallationStatus((previous) => applyInstallationMessage(previous, message));
  };
  return (
    <>
      <button
        onClick={() => {
          void manageApp("lnbits", "on");
          void manageApp("lnbits", "on");
        }}
      >
        Double request
      </button>
      <button onClick={() => send("running")}>Progress</button>
      <button onClick={() => send("finished")}>Finish</button>
    </>
  );
}

function Cards() {
  const { manageApp } = useContext(RealtimeContext);
  return (
    <AppList
      title="Apps"
      apps={[
        { id: AppId.LNBITS, installed: false, configured: false, status: "offline", version: null },
        {
          id: AppId.MEMPOOL,
          installed: false,
          configured: false,
          status: "offline",
          version: null,
        },
      ]}
      onInstall={(id) => {
        void manageApp(id, "on");
      }}
    />
  );
}

function renderFlow() {
  return render(
    <RealtimeProvider>
      <Controls />
      <Cards />
      <InstallationStatusCard appId="lnbits" />
    </RealtimeProvider>,
  );
}

function deferredResponse() {
  let resolve: (response: Response) => void = () => {};
  const promise = new Promise<Response>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

afterEach(() => {
  window.history.replaceState({}, "", "/");
});

test("failed HTTP installs release both cards and can be retried", async () => {
  let calls = 0;
  const response = deferredResponse();
  server.use(
    http.post("/api/apps/install/lnbits", () => {
      calls++;
      return calls === 1
        ? response.promise
        : HttpResponse.json({ detail: "Busy" }, { status: 409 });
    }),
  );
  renderFlow();
  fireEvent.click(screen.getAllByRole("button", { name: "apps.install" })[0]);
  expect(screen.getByRole("button", { name: "apps.installing" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "apps.install" })).toBeDisabled();
  await waitFor(() => expect(calls).toBe(1));
  await act(async () => response.resolve(HttpResponse.json({ detail: "Busy" }, { status: 409 })));
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: "apps.install" })).toHaveLength(2),
  );
  expect(screen.getAllByRole("button", { name: "apps.install" })[0]).toBeEnabled();
  expect(screen.getByText("apps.failed")).toBeVisible();
  expect(screen.getByText(/Busy/)).toBeVisible();
  fireEvent.click(screen.getAllByRole("button", { name: "apps.install" })[0]);
  await waitFor(() => expect(calls).toBe(2));
  await waitFor(() =>
    expect(screen.getAllByRole("button", { name: "apps.install" })).toHaveLength(2),
  );
});

test("one shared request blocks duplicate submissions and stays pending until finished", async () => {
  let calls = 0;
  server.use(
    http.post("/api/apps/install/lnbits", () => {
      calls++;
      return HttpResponse.json({});
    }),
  );
  renderFlow();
  fireEvent.click(screen.getByRole("button", { name: "Double request" }));
  await waitFor(() => expect(calls).toBe(1));
  expect(screen.getByRole("button", { name: "apps.installing" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Progress" }));
  fireEvent.click(screen.getByRole("button", { name: "Double request" }));
  expect(calls).toBe(1);
  fireEvent.click(screen.getByRole("button", { name: "Finish" }));
  expect(screen.getAllByRole("button", { name: "apps.install" })[0]).toBeEnabled();
  expect(screen.getByText("apps.completed")).toBeVisible();
});

test("late HTTP rejection does not overwrite progress received from the backend", async () => {
  const response = deferredResponse();
  server.use(http.post("/api/apps/install/lnbits", () => response.promise));
  renderFlow();
  fireEvent.click(screen.getAllByRole("button", { name: "apps.install" })[0]);
  fireEvent.click(screen.getByRole("button", { name: "Progress" }));
  await act(async () =>
    response.resolve(HttpResponse.json({ detail: "Proxy timeout" }, { status: 504 })),
  );
  expect(screen.getByRole("button", { name: "apps.installing" })).toBeDisabled();
  expect(screen.queryByText("apps.failed")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Finish" }));
  expect(screen.getAllByRole("button", { name: "apps.install" })[0]).toBeEnabled();
});

test("detail page starts uninstall immediately and allows retry after HTTP failure", async () => {
  const response = deferredResponse();
  let body: unknown;
  server.use(
    http.post("/api/apps/uninstall", async ({ request }) => {
      body = await request.json();
      return response.promise;
    }),
  );
  function InstalledApp() {
    const { setAppStatus } = useContext(RealtimeContext);
    return (
      <button
        onClick={() =>
          setAppStatus({
            data: [
              {
                id: AppId.LNBITS,
                installed: true,
                configured: true,
                status: "online",
                version: "1",
              },
            ],
            errors: [],
            timestamp: 1,
          })
        }
      >
        Installed
      </button>
    );
  }
  window.history.replaceState({}, "", "/apps/lnbits/info");
  render(
    <RealtimeProvider>
      <InstalledApp />
      <Routes>
        <Route path="/apps/:appId/info" element={<AppInfo />} />
      </Routes>
    </RealtimeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Installed" }));
  fireEvent.click(await screen.findByRole("button", { name: "apps.uninstall" }));
  expect(screen.getByRole("button", { name: "apps.uninstalling" })).toBeDisabled();
  await waitFor(() => expect(body).toEqual({ app_id: "lnbits", keep_data: true }));
  await act(async () => response.resolve(HttpResponse.json({ detail: "Busy" }, { status: 409 })));
  expect(await screen.findByRole("button", { name: "apps.uninstall" })).toBeEnabled();
});

test("recent completions use Unix seconds and exclude logs older than ten minutes", () => {
  const now = Date.now();
  const recent = parseInstallationMessage({
    id: "lnbits",
    mode: "on",
    state: "finished",
    message: "Recent install",
  });
  const stale = parseInstallationMessage({
    id: "mempool",
    mode: "on",
    state: "finished",
    message: "Old install",
  });
  if (!recent || !stale) throw new Error("Invalid fixtures");
  const installationStatus = applyInstallationMessage(
    applyInstallationMessage({}, { ...recent, timestamp: now / 1000 - 60 }),
    { ...stale, timestamp: now / 1000 - 601 },
  );
  render(<Apps />, {
    providerOptions: {
      realtimeProps: {
        installationStatus,
        appStatus: {
          data: [
            { id: AppId.LNBITS, installed: true, configured: true, status: "online", version: "1" },
          ],
          errors: [],
          timestamp: now / 1000,
        },
      },
    },
  });
  expect(screen.getByText("Recent install")).toBeVisible();
  expect(screen.queryByText("Old install")).not.toBeInTheDocument();
});
