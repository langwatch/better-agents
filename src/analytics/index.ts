/**
 * Analytics module for Better Agents CLI.
 *
 * Provides PostHog event tracking with automatic opt-out when
 * POSTHOG_API_KEY environment variable is not set.
 *
 * @example
 * ```ts
 * import { trackEvent, shutdown } from "../analytics/index.js";
 *
 * // Track an event
 * await trackEvent("cli_init_started", { pathType: "new" });
 *
 * // Always shutdown before process exits
 * await shutdown();
 * ```
 */
export {
  trackEvent,
  trackEventAndShutdown,
  initDistinctId,
  shutdown,
  resetClient,
  isAnalyticsEnabled,
  isTelemetryDisabled,
  type AnalyticsEvent,
  type EventProperties,
} from "./posthog";

