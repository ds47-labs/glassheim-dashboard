// Runtime config — overwritten by container entrypoint in production.
// In development this file provides an empty fallback so the app uses
// the PUBLIC_HA_URL / PUBLIC_HA_TOKEN build-time env vars instead.
window.__config__ = window.__config__ || {};
