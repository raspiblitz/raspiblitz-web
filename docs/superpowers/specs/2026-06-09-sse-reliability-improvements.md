# SSE Hook Reliability Improvements — Proposal (tackle later)

- **Date:** 2026-06-09
- **Status:** Proposal / backlog — NOT yet brainstormed, designed, or approved. Brainstorm the design before implementing.
- **Scope:** Should be its own branch/PR, independent of the HeroUI v3 migration.
- **Files:** `src/hooks/use-sse.tsx`, `src/context/sse-context.tsx`

## Context

The `useSSE` hook (used once, in the Layout) establishes a single `EventSource`
to the backend and dispatches events into `SSEContext`. While migrating to
HeroUI v3 we hit a bug where the Home dashboard was stuck on a spinner because
connect-time SSE events (`ln_info`, etc.) were missed. The immediate cause was
fixed in commit `9ed0a83` (attach listeners to the created `EventSource`
synchronously instead of a render later). That fix is the first piece of
hardening; the structure around it is still fragile and worth a focused pass.

## Confirmed reliability issues

1. **The effect re-subscribes on every SSE message.**
   `contextValue` is rebuilt as a fresh object literal on every provider render
   (`sse-context.tsx:151`, no `useMemo`), and `sseCtx` is in the `useSSE` effect
   dependency array (`use-sse.tsx`, deps include `sseCtx`). Every event → a
   setter fires → provider re-renders → new `contextValue` identity → the effect
   cleans up and re-adds all ~12 listeners. Constant teardown/rebuild churn, and
   it opens brief windows where events can be missed.

2. **The `EventSource` is never closed.**
   The effect cleanup only calls `removeEventListener`; there is no `es.close()`.
   Every re-create (login→logout→login, React StrictMode double-mount) leaks an
   open connection. Observed: many simultaneous `/api/sse/subscribe` connections
   accumulating in the backend log.

3. **Any stream error logs the user out.**
   `eventErrorHandler` calls `appCtx.logout()` on the `EventSource` `error`
   event. That event also fires on transient disconnects / auto-reconnects, so a
   brief network blip can boot the user to the login screen.

4. **Create-then-attach race (fixed in `9ed0a83`).**
   Listeners were attached only when the `evtSource` *state* became truthy (a
   render after creation), so connect-time events could arrive first. This was a
   direct consequence of issue #1's churn + a state-based connection handle.

## Options

### Option A — Targeted hardening (recommended)
Keep the current architecture; remove the failure modes.
- **Memoize `contextValue`** with `useMemo` in `SSEContextProvider` so the
  per-message re-render no longer cascades into re-subscription. (Biggest win,
  smallest change.)
- **Hold the `EventSource` in a `useRef`**, open it once, and **`close()` it on
  unmount**. Run the subscribe effect with stable dependencies (handlers read
  latest state via the stable `set*` setters, not via `sseCtx` identity).
- **Stop logging out on transient errors.** Let `EventSource` auto-reconnect;
  only `logout()` on a genuine auth failure (e.g. a 401 surfaced elsewhere).
- **Risk:** low. **Payoff:** removes churn, the connection leak, spurious
  logouts, and the race-as-a-class.

### Option B — Extract a standalone SSE client
A small module/singleton owns the `EventSource` (connect/disconnect,
reconnection + backoff) and exposes `subscribe(event, cb)`. The React context
just mirrors its state. Cleanest separation of connection lifecycle from React
render; bigger change, needs its own tests.

### Option C — Adopt a library
e.g. `@microsoft/fetch-event-source` — gives retry/backoff and auth-header
support on the stream, but adds a dependency. Likely YAGNI unless auth headers
on the stream become a requirement.

## Recommendation

**Option A**, as its own PR separate from the HeroUI migration. Highest
reliability gain for the least risk. If a deeper rework is wanted later, Option
B is the natural next step.

## Actionable checklist for Option A (when picked up)

- [ ] Brainstorm/confirm the design (esp. the ref-based single-connection
      lifecycle and the error/reconnect/logout policy) before coding.
- [ ] `useMemo(contextValue, [...all state...])` in `src/context/sse-context.tsx`.
- [ ] Refactor `use-sse.tsx`: `EventSource` in a `useRef`, created once, closed
      on unmount; single subscribe effect with stable deps.
- [ ] Replace the blanket `error → logout` with a transient-vs-auth distinction
      (rely on `EventSource`'s built-in reconnection for transient drops).
- [ ] Verify in `dev:local`: one `/api/sse/subscribe` connection per session
      (no accumulation), dashboard loads reliably on fresh login, and a brief
      backend restart reconnects without logging the user out.
- [ ] Keep/extend the existing unit tests around SSE handling.
