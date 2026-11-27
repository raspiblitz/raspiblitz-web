// Fail the live run instead of letting realtime-live.spec.ts skip silently.
// The check lives here rather than in playwright.live.config.ts so that
// loading the config (knip, IDE test explorers) works without credentials.
export default function globalSetup() {
  if (!process.env.BACKEND_SERVER || !process.env.BLITZ_API_PASSWORD) {
    throw new Error('Live tests require BACKEND_SERVER and BLITZ_API_PASSWORD');
  }
}
