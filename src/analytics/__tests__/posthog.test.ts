import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  trackEvent,
  trackEventAndShutdown,
  shutdown,
  resetClient,
  isAnalyticsEnabled,
} from "../posthog.js";

// Mock posthog-node
vi.mock("posthog-node", () => ({
  PostHog: vi.fn().mockImplementation(() => ({
    capture: vi.fn(),
    flush: vi.fn().mockResolvedValue(undefined),
    shutdown: vi.fn().mockResolvedValue(undefined),
  })),
}));

// Mock machine-id module
vi.mock("../machine-id.js", () => ({
  getOrCreateMachineId: vi.fn().mockResolvedValue("test-machine-id-12345"),
}));

describe("posthog analytics", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment and client state before each test
    process.env = { ...originalEnv };
    delete process.env.POSTHOG_API_KEY;
    delete process.env.POSTHOG_HOST;
    delete process.env.VITEST;
    delete process.env.NODE_ENV;
    resetClient();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetClient();
  });

  describe("isAnalyticsEnabled", () => {
    it("returns false when POSTHOG_API_KEY is not set", () => {
      delete process.env.POSTHOG_API_KEY;
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns false when VITEST env var is set", () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";
      process.env.VITEST = "true";
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns false when NODE_ENV is test", () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";
      process.env.NODE_ENV = "test";
      expect(isAnalyticsEnabled()).toBe(false);
    });

    it("returns true when POSTHOG_API_KEY is set and not in test mode", () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";
      expect(isAnalyticsEnabled()).toBe(true);
    });
  });

  describe("trackEvent", () => {
    it("does not throw when analytics is disabled", async () => {
      delete process.env.POSTHOG_API_KEY;
      await expect(
        trackEvent("cli_init_started", { pathType: "new" })
      ).resolves.not.toThrow();
    });

    // removed cli_completed event; no specific success test needed

    it("accepts all defined event types", async () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";

      await expect(trackEvent("cli_init_started", {})).resolves.not.toThrow();
      resetClient();

      await expect(trackEvent("cli_prompt_shown", {})).resolves.not.toThrow();
      resetClient();

      await expect(trackEvent("cli_init_failed", {})).resolves.not.toThrow();
    });
  });

  describe("shutdown", () => {
    it("does not throw when client is not initialized", async () => {
      await expect(shutdown()).resolves.not.toThrow();
    });

    it("does not throw after tracking events", async () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";
      await trackEvent("cli_init_started", {});
      await expect(shutdown()).resolves.not.toThrow();
    });
  });

  describe("resetClient", () => {
    it("clears client state without throwing", () => {
      expect(() => resetClient()).not.toThrow();
    });
  });

  describe("trackEventAndShutdown", () => {
    it("does not throw when analytics is disabled", async () => {
      delete process.env.POSTHOG_API_KEY;
      await expect(
        trackEventAndShutdown("cli_init_failed", {})
      ).resolves.not.toThrow();
    });

    it("does not throw when called with valid event", async () => {
      process.env.POSTHOG_API_KEY = "phc_test_key";
      await expect(
        trackEventAndShutdown("cli_init_failed", {
          step: "cancelled",
          durationSec: 1.5,
          success: false,
        })
      ).resolves.not.toThrow();
    });
  });
});

