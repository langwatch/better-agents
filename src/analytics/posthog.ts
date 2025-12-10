import { PostHog } from "posthog-node";
import { getOrCreateMachineId } from "./machine-id";
import os from "node:os";

/**
 * Properties that can be passed to trackEvent.
 * Uses unknown for flexibility while maintaining type safety.
 */
export type EventProperties = Record<string, unknown>;

/**
 * Supported analytics event names for the CLI.
 */
export type AnalyticsEvent =
  | "cli_init_started"
  | "cli_prompt_shown"
  | "cli_init_failed";

let client: PostHog | null = null;
let distinctId: string | null = null;

const TELEMETRY_FLAG = "BETTER_AGENTS_TELEMETRY";

export const isTelemetryDisabled = (): boolean => {
  const flag = process.env[TELEMETRY_FLAG];
  if (!flag) return false;
  const value = flag.toLowerCase().trim();
  return ["0", "false", "off", "disable", "disabled", "no"].includes(value);
};

/**
 * Checks if analytics is enabled based on environment variables.
 * Analytics requires POSTHOG_API_KEY to be set.
 *
 * @returns True if analytics should be enabled
 *
 * @example
 * ```ts
 * if (isAnalyticsEnabled()) {
 *   // proceed with tracking
 * }
 * ```
 */
export const isAnalyticsEnabled = (): boolean => {
  // Disable in test environments
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return false;
  }
  if (isTelemetryDisabled()) {
    return false;
  }
  return Boolean(process.env.POSTHOG_API_KEY);
};

/**
 * Gets or initializes the PostHog client singleton.
 * Returns null if analytics is disabled.
 *
 * @returns PostHog client instance or null
 */
const getClient = (): PostHog | null => {
  if (!isAnalyticsEnabled()) {
    return null;
  }

  if (!client) {
    const apiKey = process.env.POSTHOG_API_KEY;
    if (!apiKey) {
      return null;
    }

    client = new PostHog(apiKey, {
      host: process.env.POSTHOG_HOST || "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
      // ensure GeoIP stays enabled
      disableGeoip: false,
    });
  }

  return client;
};

/**
 * Gets the distinct ID for the current machine.
 * Lazily initializes the machine ID on first call.
 *
 * @returns The machine's distinct ID or "anonymous" if unavailable
 */
const getDistinctId = async (): Promise<string> => {
  if (!distinctId) {
    try {
      distinctId = await getOrCreateMachineId();
    } catch {
      distinctId = "anonymous";
    }
  }
  return distinctId;
};

/**
 * Initialize the distinct ID synchronously if possible.
 * Call this early in the CLI to ensure ID is ready for SIGINT handlers.
 */
export const initDistinctId = async (): Promise<void> => {
  await getDistinctId();
};

/**
 * Tracks an analytics event to PostHog.
 * No-ops gracefully if analytics is disabled or if an error occurs.
 * Flushes immediately to ensure event is sent.
 *
 * @param event - The event name to track
 * @param properties - Optional properties to attach to the event
 *
 * @example
 * ```ts
 * await trackEvent("cli_init_started", { pathType: "new" });
 * await trackEvent("cli_completed", {
 *   language: "typescript",
 *   framework: "mastra",
 *   durationSec: 1.5,
 *   success: true,
 * });
 * ```
 */
export const trackEvent = async (
  event: AnalyticsEvent,
  properties: EventProperties = {}
): Promise<void> => {
  try {
    const posthog = getClient();
    if (!posthog) {
      return;
    }

    const id = await getDistinctId();

    posthog.capture({
      distinctId: id,
      event,
      properties: {
        ...properties,
        cliVersion: process.env.npm_package_version || "unknown",
        osPlatform: os.platform(),
        osRelease: os.release(),
        // Hint PostHog to perform GeoIP; both keys for safety
        $ip: "$remote_ip",
        ip: "$remote_ip",
        $geoip_disable: false,
      },
    });

    // Flush immediately
    await posthog.flush();
  } catch {
    // Silently ignore analytics errors - never break the CLI
  }
};

/**
 * Tracks an event and shuts down - for use before process exit.
 * Blocks until the event is sent.
 *
 * @param event - The event name to track
 * @param properties - Optional properties to attach to the event
 */
export const trackEventAndShutdown = async (
  event: AnalyticsEvent,
  properties: EventProperties = {}
): Promise<void> => {
  try {
    const posthog = getClient();
    if (!posthog) {
      return;
    }

    const id = distinctId || "anonymous";

    posthog.capture({
      distinctId: id,
      event,
      properties: {
        ...properties,
        cliVersion: process.env.npm_package_version || "unknown",
        osPlatform: os.platform(),
        osRelease: os.release(),
        $ip: "$remote_ip",
        ip: "$remote_ip",
        $geoip_disable: false,
      },
    });

    // Shutdown flushes all pending events
    await posthog.shutdown();
    client = null;
  } catch {
    // Silently ignore analytics errors
  }
};

/**
 * Shuts down the PostHog client and flushes any pending events.
 * Should be called before the process exits to ensure all events are sent.
 *
 * @example
 * ```ts
 * // At end of CLI command
 * await shutdown();
 * ```
 */
export const shutdown = async (): Promise<void> => {
  try {
    if (client) {
      await client.shutdown();
      client = null;
    }
  } catch {
    // Silently ignore shutdown errors
  }
};

/**
 * Resets the analytics client state.
 * Useful for testing to ensure clean state between tests.
 *
 * @example
 * ```ts
 * // In test teardown
 * resetClient();
 * ```
 */
export const resetClient = (): void => {
  client = null;
  distinctId = null;
};
